import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
    'name',
    'price',
    'description',
    'options',
]) {
    @Field(() => Number)
    @IsNumber()
    restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput { }
