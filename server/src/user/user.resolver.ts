import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'auth/auth.decorator';
import { Role } from 'auth/role.decorator';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { GetProfileOutput } from './dtos/getProfile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { RegisterInput, RegisterOutput } from './dtos/register.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => GetProfileOutput)
    @Role(['Any'])
    getMyProfile(@Auth() auth: User): GetProfileOutput {
        return {
            ok: true,
            error: 'Get profile successful',
            user: auth
        }
    }

    @Query(() => UserProfileInput)
    @Role(['Any'])
    getUserProfile(
        @Args() userProfileInput: UserProfileInput,
    ): Promise<UserProfileOutput> {
        const { userId } = userProfileInput;
        return this.userService.userProfile({ userId });
    }

    @Mutation(() => RegisterOutput)
    register(
        @Args('input') registerInput: RegisterInput,
    ): Promise<RegisterOutput> {
        return this.userService.register(registerInput);
    }

    @Mutation(() => LoginOutput)
    login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.userService.login(loginInput);
    }

    @Mutation(() => EditProfileOutput)
    @Role(['Any'])
    editProfile(
        @Auth() authUser: User,
        @Args('input') editProfileInput: EditProfileInput,
    ): Promise<EditProfileOutput> {
        return this.userService.editProfile(authUser.id, editProfileInput);
    }
}
