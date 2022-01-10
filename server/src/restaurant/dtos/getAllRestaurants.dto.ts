import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationInput, PaginationOutput } from 'core/dtos/pagination.dto';

import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class GetAllRestaurantsInput extends PaginationInput { }

@ObjectType()
export class GetAllRestaurantsOutput extends PaginationOutput {
    @Field(() => [Restaurant], { nullable: true })
    @IsOptional()
    restaurants?: Restaurant[];
}
