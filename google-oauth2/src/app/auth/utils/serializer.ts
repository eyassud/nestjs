import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.id);
        console.log(`deserializeUser: ${user}`);

        return user ? done(null, user) : done(null, null);
    }

}