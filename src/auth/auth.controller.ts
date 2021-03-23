import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {UserDecorator} from "./decorators/user.decorator";
import {User} from "../users/entities/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(204)
    async logout(@UserDecorator() user: User) {
        return this.authService.logout(user);
    }
}
