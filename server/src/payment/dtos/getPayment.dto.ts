import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Payment } from 'payment/entities/payment.entities';

@ObjectType()
export class GetPaymentOutput extends CoreOutput {
    @Field(() => [Payment], { nullable: true })
    @IsOptional()
    payments?: Payment[];
}
