import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'user/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req?.headers?.token) {
      const token: string | string[] = req.headers['token'];
      const payload: string | object = await this.jwtService.verify(
        token.toString(),
      );

      if (typeof payload === 'object' && payload.hasOwnProperty('id')) {
        try {
          const foundUser = await this.userService.seeUserProfile(
            payload['id'],
          );
          if (foundUser) {
            req['user'] = foundUser;
          } else {
            throw new Error('유저를 찾지 못했습니다.');
          }
        } catch (error) {
          console.log('JwtMiddleware error', error);
        }
      }
    }
    next();
  }
}
