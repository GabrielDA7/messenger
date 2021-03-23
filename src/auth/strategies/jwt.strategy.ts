import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ExtractJwt} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {JwtPayload} from "../interfaces/jwt.interface";
import {UsersService} from "../../users/users.service";
import {User} from "../../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: JwtPayload) : Promise<User> {
        const user = await this.userService.findOneById(payload.sub);
        if(!user) throw new UnauthorizedException('invalid token data');
        return user;
    }
}
