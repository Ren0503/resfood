import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'core/dtos/core.output';
import { User } from 'user/entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) { }

@ObjectType()
export class LoginOutput extends CoreOutput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    token?: string;
}