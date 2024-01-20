import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../logger.middleware';
import { PrismaService } from './prisma-service.service';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    PostService,
    JwtService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
