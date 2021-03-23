import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import {User} from "../users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;

        const user = await this.validateUser(email, password);
        if(!user) throw new UnauthorizedException('Invalid credentials');

        if(!user.isConnected) await this.usersService.setConnected(user, true);

        return {
            accessToken: this.jwtService.sign({ email: user.email, sub: user.id }),
        };
    }

    async logout(user: User) {
        if(user.isConnected) await this.usersService.setConnected(user, false);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if(user && await user.comparePassword(pass)) {
            return user;
        }
        return null;
    }
}
