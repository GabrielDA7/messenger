import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UsersModule} from "../users/users.module";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  imports: [
      ConfigModule,
      UsersModule,
      PassportModule,
      JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRATION') },
          }),
          inject: [ConfigService]
      })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
