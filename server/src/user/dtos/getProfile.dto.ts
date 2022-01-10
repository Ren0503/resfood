import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'core/dtos/core.output';
import { User } from 'user/entities/user.entity';

export class GetProfileInput {}

@ObjectType()
export class GetProfileOutput extends CoreOutput {
    @Field(() => User)
    user: User;
}