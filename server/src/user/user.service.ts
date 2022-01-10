import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'jwt/jwt.service';
import { Repository } from 'typeorm';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { RegisterInput, RegisterOutput } from './dtos/register.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification)
        private readonly verification: Repository<Verification>,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        registerInput: RegisterInput,
    ): Promise<RegisterOutput> {
        try {
            const { email, password, role } = registerInput;

            const existingUser = await this.users.findOne({ email });
            if (existingUser) {
                return { ok: false, error: 'Email already used' };
            }

            const newUser = this.users.create({ email, password, role });
            const createdUser = await this.users.save(newUser);

            const newVerification = this.verification.create({
                user: createdUser,
            });

            await this.verification.save(newVerification);

            return { ok: true, error: 'Register successful.' };
        } catch (error) {
            console.log('Register error');
            return { ok: false, error: 'Something went wrong' };
        }
    }

    async login(loginInput: LoginInput): Promise<LoginOutput> {
        try {
            const { email, password } = loginInput;

            const existingUser = await this.users.findOne(
                { email },
                { select: ['id', 'password'] },
            );

            if (!existingUser) {
                return { ok: false, error: 'Login failed, not found account' };
            }

            const isCorrectPassword = await existingUser.checkPassword(password);

            if (isCorrectPassword === false) {
                return { ok: false, error: 'Password incorrect' };
            }

            const token = this.jwtService.sign(existingUser.id);

            return { ok: true, error: 'Login successful.', token };
        } catch (error) {
            console.log('Login error');
            return { ok: false, error: 'Something went wrong' };
        }
    }

    async userProfile(
        userProfileInput: UserProfileInput,
    ): Promise<UserProfileOutput> {
        try {
            const foundUser = await this.users.findOne({
                id: userProfileInput.userId
                    ? userProfileInput.userId
                    : Number(userProfileInput),
            });

            if (!foundUser) {
                return { ok: false, error: '404 Not Found' };
            }

            return {
                ok: true,
                error: 'Get User Profile Successful',
                user: foundUser,
            };
        } catch (error) {
            console.log('get user profile error');
            return { ok: false, error: 'Something went wrong' };
        }
    }

    async editProfile(
        userId: number,
        editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            const user = await this.users.findOne(userId);
            if (!user) {
                return { ok: false, error: 'Not found user.' };
            }

            const { email, password } = editProfileInput;
            if (email) {
                const foundUser = await this.users.findOne({ email });
                if (foundUser) {
                    return { ok: false, error: 'Get user successful.' };
                }

                user.email = email;
                user.emailVerification = false;
                await this.verification.delete({ user: { id: user.id } });

                const newVerification = this.verification.create({ user });
                await this.verification.save(
                    newVerification,
                );
            }

            if (password) {
                user.password = password;
            }
            await this.users.save(user);
            return { ok: true, error: 'Update profile successful.' };
        } catch (error) {
            console.log('Edit Profile error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }
}
