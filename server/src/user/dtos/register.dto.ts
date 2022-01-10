import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'core/dtos/core.output';
import { User } from 'user/entities/user.entity';

@InputType()
export class RegisterInput extends PickType(User, [
    'email',
    'password',
    'role'
]) { }

@ObjectType()
export class RegisterOutput extends CoreOutput { }