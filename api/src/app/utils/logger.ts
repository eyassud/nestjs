import { JwtService } from "@nestjs/jwt";
import * as moment from 'moment-timezone';

export const logTokenInfo = (req: any, jwtService: JwtService) => {
    console.log(`Profile User is: ${JSON.stringify(req.user)}`);
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwtService.decode(token);
    const expiration = decoded.exp;
    const localExpiration = moment.unix(expiration).tz(moment.tz.guess());
    console.log('Token expires at:', localExpiration.format('YYYY-MM-DD HH:mm:ss'));
}