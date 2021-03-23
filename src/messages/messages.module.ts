import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./entities/message.entity";
import {UsersModule} from "../users/users.module";
import {MessageMiddleware} from "./middlewares/message.middleware";

@Module({
  imports: [
      TypeOrmModule.forFeature([Message]),
      UsersModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MessageMiddleware)
            .forRoutes(
                { path: '/messages/:id/answer', method: RequestMethod.POST },
                { path: '/messages/:id', method: RequestMethod.GET },
                { path: '/messages/:id/read', method: RequestMethod.GET },
                { path: '/messages/:id', method: RequestMethod.PATCH },
                { path: '/messages/:id', method: RequestMethod.DELETE },
                { path: '/messages/:id/archive', method: RequestMethod.PATCH }
            );
    }
}
