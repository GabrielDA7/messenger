import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {SendDto} from "./dto/send.dto";
import {Message} from "./entities/message.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {User} from "../users/entities/user.entity";
import {AnswerMessageDto} from "./dto/answer-message.dto";
import {UpdateMessageDto} from "./dto/update-message.dto";

@Injectable()
export class MessagesService {
  constructor(
      @InjectRepository(Message)
      private messageRepository: Repository<Message>,
      private userService: UsersService
  ) {}

  async send(sendDto: SendDto, sender: User) {
    const recipient = await this.userService.findOneById(sendDto.recipientId);
    if(!recipient) throw new NotFoundException('the recipient does not exist');

    const message = new Message(sendDto);
    message.recipient = recipient;
    message.sender = sender;
    return this.messageRepository
        .save(message)
        .catch(() => {
          throw new InternalServerErrorException('could not send message')
        });
  }

  async answer(parentMessage: Message, answerMessageDto: AnswerMessageDto, sender: User) {
    const answer = new Message(answerMessageDto);
    answer.recipient = parentMessage.sender;
    answer.sender = sender;
    answer.parentMessage = parentMessage;

    return this.messageRepository
        .save(answer)
        .catch(() => {
          throw new InternalServerErrorException('could not send answer')
        });
  }

  async findOneById(id: number) {
    return this.messageRepository
        .findOne({where : {id}, relations: ['parentMessage', 'sender', 'answers', 'recipient']})
        .catch(() => {
          throw new InternalServerErrorException('could not get message')
        });
  }

  async update(message: Message, updateMessageDto: UpdateMessageDto) {
    const updatedMessage = Object.assign(message, updateMessageDto);
    return this.messageRepository
        .save(updatedMessage)
        .catch(() => {
          throw new InternalServerErrorException('could not update message')
        });
  }

  async remove(message: Message) {
    if(message.deleted) return;
    message.deleted = true;
    await this.messageRepository
        .save(message)
        .catch(() => {
          throw new InternalServerErrorException('could not delete message')
        });
  }

  getAll(user: User) {
    return this.messageRepository
        .find({where:{recipient: user.id, deleted: false, archived: false}, relations: ['parentMessage', 'sender', 'answers', 'recipient']})
        .catch(() => []);
  }

  getAllDeleted(user: User) {
    return this.messageRepository
        .find({where:{recipient: user.id, deleted: true}, relations: ['parentMessage', 'sender', 'answers', 'recipient']})
        .catch(() => []);
  }

  getAllArchived(user: User) {
    return this.messageRepository
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.parentMessage', 'parentMessage')
        .leftJoinAndSelect('m.answers', 'answers')
        .innerJoinAndSelect('m.sender', 'sender')
        .innerJoinAndSelect('m.recipient', 'recipient')
        .where("m.archived = :archived AND (recipient.id = :userId OR sender.id = :userId)", {archived: true, userId: user.id})
        .getMany()
  }

  read(user: User, message: Message) {
    if(message.readed) return message;
    message.readed = true;
    return this.messageRepository
        .save(message)
        .catch(() => {
          throw new InternalServerErrorException('could not read message')
        });
  }

  archive(user: User, message: Message) {
    if(message.archived) return message;
    message.archived = true;
    return this.messageRepository
        .save(message)
        .catch(() => {
          throw new InternalServerErrorException('could not archive message')
        });
  }


}
