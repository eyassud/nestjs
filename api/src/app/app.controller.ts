import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PostDto } from '../models/post';
import { UserDto } from '../models/userDto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment-timezone'; // For local datetime formatting

@ApiTags('posts')
@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(`User is: ${JSON.stringify(req.user)}`);
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(`Profile User is: ${JSON.stringify(req.user)}`);
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);
    const expiration = decoded.exp;
    const localExpiration = moment.unix(expiration).tz(moment.tz.guess());
    console.log('Token expires at:', localExpiration.format('YYYY-MM-DD HH:mm:ss'));

    return req.user;
  }

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  @ApiBody({ type: PostDto })
  async createDraft(
    @Body() postData: PostDto //{ title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  async signupUser(
    @Body() userData: UserDto //{ name?: string; email: string },
  ): Promise<UserModel> {
    const { name, email } = userData;
    return this.userService.createUser({ name, email });
  }

  // write a method that take a user id and returns all the posts of that user  
  @Get('user/:id/posts') // add this line
  async getUserPosts(@Param('id') id: string): Promise<{ name: string, email: string, id: number }> {
    return this.userService.userWithPosts({ id: Number(id) });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}