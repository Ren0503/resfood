import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'core/dtos/core.output';
import { User } from 'user/entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType (
    PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput { }