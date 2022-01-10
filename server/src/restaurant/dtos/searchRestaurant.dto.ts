import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput, PaginationOutput } from 'core/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
    @Field(() => String)
    @IsString()
    query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
    @Field(() => [Restaurant], { nullable: true })
    @IsOptional()
    restaurants?: Restaurant[];
}
