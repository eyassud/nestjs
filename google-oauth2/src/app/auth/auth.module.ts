import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../utils/google-strategy';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SessionSerializer } from './utils/serializer';

@Module({
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    PrismaService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService
    },
    SessionSerializer
  ]
})
export class AuthModule { }
