import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { CreateRestaurantInput } from './createRestaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
    @Field(() => Number)
    @IsNumber()
    restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput { }
