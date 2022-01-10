import {
    Field,
    InputType,
    ObjectType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Dish } from '../entities/dish.entity';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
    'name',
    'price',
    'description',
    'options',
]) {
    @Field(() => Number)
    @IsNumber()
    dishId: number;
}

@ObjectType()
export class EditDishOutput extends CoreOutput { }
