import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
dotenv.config();

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            //global: true,
            //secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60s' },
            //secretOrPrivateKey: process.env.JWT_SECRET,
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
