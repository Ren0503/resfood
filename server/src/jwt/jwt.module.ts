import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
    static forRoot(options?: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [
                { provide: 'jwtModuleOptions', useValue: options },
                { provide: JwtService, useClass: JwtService },
            ],
            exports: [JwtService]
        };
    }
}
