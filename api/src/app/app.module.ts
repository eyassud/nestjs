import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../logger.middleware';
import { PrismaService } from './prisma-service.service';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    PostService,
    AuthService,
    UsersService,
    JwtService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
