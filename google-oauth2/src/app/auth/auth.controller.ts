import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../utils/guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    handleLogin() {
        return { msg: 'Google authentication' };
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/redirect')
    handleRedirect() {
        return { msg: 'OK' }
    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user);

        if (request.user) {
            return { msg: 'Authenticated' };
        } else {
            return { msg: 'Not Authenticated' };
        }
    }
}
