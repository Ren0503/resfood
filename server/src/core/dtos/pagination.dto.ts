import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from './core.output';

@InputType()
export class PaginationInput {
    @Field(() => Number, { defaultValue: 1 })
    @IsNumber()
    page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
    @Field(() => Number, { nullable: true })
    @IsNumber()
    @IsOptional()
    totalPages?: number;

    @Field(() => Number, { nullable: true })
    @IsNumber()
    @IsOptional()
    totalResults?: number;
}
