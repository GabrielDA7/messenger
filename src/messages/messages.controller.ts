import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {SendDto} from "./dto/send.dto";
import {UserDecorator} from "../auth/decorators/user.decorator";
import {AnswerMessageDto} from "./dto/answer-message.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {MessageDecorator} from "./decorators/message.decorator";
import {Message} from "./entities/message.entity";
import {RecipientGuard} from "./guards/recipient.guard";
import {UpdateMessageDto} from "./dto/update-message.dto";
import {AuthorGuard} from "./guards/author.guard";
import {User} from "../users/entities/user.entity";
import {AuthorRecipientGuard} from "./guards/author-recipient.guard";

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @UseGuards(JwtAuthGuard)
  send(@Body() sendInDto: SendDto, @UserDecorator() sender: User) {
    return this.messagesService.send(sendInDto, sender);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/answer')
  @UseGuards(JwtAuthGuard, RecipientGuard)
  answer(@MessageDecorator() parentMessage: Message, @Body() answerMessageInDto: AnswerMessageDto, @UserDecorator() sender: User) {
    return this.messagesService.answer(parentMessage, answerMessageInDto, sender);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  update(@MessageDecorator() message: Message, @Body() updateMessageInDto: UpdateMessageDto) {
    return this.messagesService.update(message, updateMessageInDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RecipientGuard)
  @HttpCode(204)
  remove(@MessageDecorator() message: Message) {
    return this.messagesService.remove(message);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@UserDecorator() user: User) {
    return this.messagesService.getAll(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  getDeleted(@UserDecorator() user: User) {
    return this.messagesService.getAllDeleted(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('archived')
  @UseGuards(JwtAuthGuard)
  getArchived(@UserDecorator() user: User) {
    return this.messagesService.getAllArchived(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/read')
  @UseGuards(JwtAuthGuard, RecipientGuard)
  read(@UserDecorator() user: User, @MessageDecorator() message: Message) {
    return this.messagesService.read(user, message);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @UseGuards(JwtAuthGuard, AuthorRecipientGuard)
  get(@MessageDecorator() message: Message) {
    return message;
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard, AuthorRecipientGuard)
  @HttpCode(204)
  archive(@UserDecorator() user: User, @MessageDecorator() message: Message) {
    return this.messagesService.archive(user, message);
  }
}
