import {Injectable, NestMiddleware, NotFoundException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {MessagesService} from "../messages.service";

@Injectable()
export class MessageMiddleware implements NestMiddleware {
    constructor(
        private messageService: MessagesService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const messageId = Number(req.params.id);
        if(messageId) {
            const message = await this.messageService.findOneById(messageId);
            if(!message) throw new NotFoundException('message not found')
            req['message'] = message;
        }
        next();
    }
}
