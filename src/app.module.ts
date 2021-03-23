import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import configuration from '../config';

@Module({
  imports: [
    ConfigModule.forRoot(configuration),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MessagesModule,
  ],
})
export class AppModule {}
