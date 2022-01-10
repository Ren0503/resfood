import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Order } from '../entities/order.entity';

@InputType()
export class GetOrderInput extends PickType(Order, ['id']) { }

@ObjectType()
export class GetOrderOutput extends CoreOutput {
    @Field(() => Order, { nullable: true })
    @IsOptional()
    order?: Order;
}
