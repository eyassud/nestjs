import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PostDto } from '../models/post';
import { UserDto } from '../models/userDto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SkipAuth } from './skip-auth';
import { logTokenInfo } from './utils/logger';

@ApiTags('posts')
@Controller()
export class AppController {
    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService,
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) { }


    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Post('auth/login')
    async login(@Body() signInDto: Record<string, any>) {
        return this.authService.login(signInDto.username, signInDto.password);
    }

    @Get('profile')
    getProfile(@Request() req) {
        logTokenInfo(req, this.jwtService);
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