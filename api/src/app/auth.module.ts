import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth-guard';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '360s' },
        }),
    ],
    providers: [
        AuthService, LocalStrategy, JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    exports: [AuthService],
})
export class AuthModule { }
