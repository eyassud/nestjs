import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {
        this.usersService = usersService;
    }

    async validateUser(username, pass) {
        console.log(`Username is: ${username}`);
        const user = await this.usersService.findOne(username);

        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        console.log(`Payload is: ${JSON.stringify(payload)}`);
        console.log(`Access token is: ${process.env.JWT_SECRET}`);
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        };
    }
}