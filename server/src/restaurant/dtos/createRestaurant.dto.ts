import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
    'name',
    'coverImage',
    'address',
]) {
    @Field(() => String)
    @IsString()
    categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput { }
