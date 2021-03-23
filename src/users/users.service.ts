import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {email} = createUserDto;

    const user = await this.userRepository.findOne({where: {email}});
    if(user) throw new BadRequestException(`${email} already exists`);

    return this.userRepository
        .save(new User(createUserDto))
        .catch(() => {
          throw new InternalServerErrorException('could not register user')
        });
  }

  findOneByEmail(email: string) {
      const user = this.userRepository.findOne({where: {email}});
      if(!user) throw new NotFoundException('user not found');
      return user;
  }

  findOneById(id: number) {
      const user = this.userRepository.findOne({where: {id}});
      if(!user) throw new NotFoundException('user not found');
      return user;
  }

  setConnected(user: User, connected: boolean) {
      user.isConnected = connected;
      return this.userRepository.save(user);
  }
}
