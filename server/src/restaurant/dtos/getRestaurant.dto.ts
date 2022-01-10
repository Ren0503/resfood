import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class GetRestaurantInput {
    @Field(() => Number)
    @IsNumber()
    restaurantId: number;
}

@ObjectType()
export class GetRestaurantOutput extends CoreOutput {
    @Field(() => Restaurant, { nullable: true })
    @IsOptional()
    restaurant?: Restaurant;
}
