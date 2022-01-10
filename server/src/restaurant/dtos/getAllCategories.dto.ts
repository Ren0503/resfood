import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { Category } from '../entities/category.entity';

@ObjectType()
export class GetAllCategoriesOutput extends CoreOutput {
    @Field(() => [Category], { nullable: true })
    @IsOptional()
    categories?: Category[];
}
