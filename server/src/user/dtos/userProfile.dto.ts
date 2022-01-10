import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
    @Field(() => Number)
    @IsNumber()
    userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
    @Field(() => User, { nullable: true })
    @IsOptional()
    user?: User;
}
