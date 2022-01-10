import { Module } from '@nestjs/common';
import { AppController } from './user/controller/app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, CoreModule, JwtModule, RestaurantsModule, PaymentModule, OrderModule, RestaurantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
