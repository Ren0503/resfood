import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import { Payment } from './entities/payment.entities';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentResolver, PaymentService]
})
export class PaymentModule { }
