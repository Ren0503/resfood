import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
    constructor(
        @Inject('JwtModuleOptions')
        private readonly jwtModuleOptions: JwtModuleOptions
    ) { }

    sign(existingUserId: number): string {
        const token = jwt.sign(
            { id: existingUserId },
            this.jwtModuleOptions.privateKey,
        );
        return token;
    }

    async verify(token: string): Promise<string | object> {
        const payload = await jwt.verify(token, this.jwtModuleOptions.privateKey);
        return payload;
    }
}
