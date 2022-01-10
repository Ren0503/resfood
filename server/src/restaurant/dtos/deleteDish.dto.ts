import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';

@InputType()
export class DeleteDishInput {
    @Field(() => Number)
    @IsNumber()
    dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput { }
