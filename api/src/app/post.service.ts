import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-service.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) { }

    // write a method that returns a post and its author    
    async postWithAuthor(
        postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    ): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: postWhereUniqueInput,
            include: {  // include the author object in the response    
                author: true,
            }
        });
    }

    async post(
        postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    ): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: postWhereUniqueInput,
            include: {  // include the author object in the response
                author: true,
            },
        });
    }

    async posts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<Post[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.post.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createPost(data: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({
            data,
        });
    }

    async updatePost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: Prisma.PostUpdateInput;
    }): Promise<Post> {
        const { data, where } = params;
        return this.prisma.post.update({
            data,
            where,
        });
    }

    async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
        return this.prisma.post.delete({
            where,
        });
    }
}