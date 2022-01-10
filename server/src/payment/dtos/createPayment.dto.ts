import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'core/dtos/core.output';
import { Payment } from 'payment/entities/payment.entities';

@InputType()
export class CreatePaymentInput extends PickType(Payment, [
    'transactionId',
    'restaurantId',
]) { }

@ObjectType()
export class CreatePaymentOutput extends CoreOutput { }
