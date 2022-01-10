import Joi from 'joi';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'user/entities/user.entity';
import { Verification } from 'user/entities/verification.entity';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import { Category } from 'restaurant/entities/category.entity';
import { Dish } from 'restaurant/entities/dish.entity';
import { Order } from 'order/entities/order.entity';
import { OrderItem } from 'order/entities/orderItem.entity';
import { Payment } from 'payment/entities/payment.entities';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.number().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),

    GraphQLModule.forRoot({
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            return connectionParams;
          },
        },
      },
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req }) => {
        return { token: req.headers.token };
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
        Payment,
      ],
    }),

    JwtModule.forRoot({ privateKey: process.env.PRIVATE_KEY }),

    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    RestaurantModule,
    OrderModule,
    CoreModule,
    PaymentModule,
  ]
})
export class AppModule { }
