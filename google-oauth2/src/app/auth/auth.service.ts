import { Injectable } from "@nestjs/common";
import { UserDetails } from "./utils/user-details";
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService) { }

    async validateUser(details: UserDetails) {
        console.log('AuthService');
        console.log(details);

        const user = await this.prismaService.user.findUnique({ where: { email: details.email } });

        if (user) return user;

        console.log('User not found, creating ...');
        const newUser = this.prismaService.user.create({ data: { email: details.email, displayName: details.displayName } });
        console.log(newUser);

        return newUser;
    }

    async findUser(id: number) {
        const user = await this.prismaService.user.findUnique({ where: { id: id } });

        return user;
    }
}