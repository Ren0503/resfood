import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { OrderItemOption } from '../entities/orderItem.entity';

@InputType()
class CreateOrderItemInput {
    @Field(() => Number)
    @IsNumber()
    dishId: number;

    @Field(() => [OrderItemOption], { nullable: true })
    options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
    @Field(() => Number)
    @IsNumber()
    restaurantId: number;

    @Field(() => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput { }
