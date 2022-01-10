import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';

@InputType()
export class DeleteRestaurantInput {
    @Field(() => Number)
    @IsNumber()
    restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput { }
