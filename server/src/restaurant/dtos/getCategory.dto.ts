import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInput, PaginationOutput } from 'core/dtos/pagination.dto';
import { Category } from 'restaurant/entities/category.entity';

@InputType()
export class GetCategoryInput extends PaginationInput {
    @Field(() => String)
    @IsString()
    slug: string
}

@ObjectType()
export class GetCategoryOutput extends PaginationOutput {
    @Field(() => Category, { nullable: true })
    @IsOptional()
    category?: Category;
}