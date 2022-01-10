import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'jwt/jwt.service';
import { UserService } from 'user/user.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (roles === undefined) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (!token) {
      return;
    }

    const payload = await this.jwtService.verify(token.toString());

    if (typeof payload === 'object' && payload.hasOwnProperty('id')) {
      try {
        const foundUser = await this.userService.userProfile(payload['id']);

        if (!foundUser) {
          return false;
        }
        if (roles.includes('Any')) {
          gqlContext['user'] = foundUser;
          return true;
        }
      } catch (error) {
        console.log('AuthGuard error');
      }
    }
  }
}
