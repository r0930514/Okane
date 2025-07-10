import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CommonUtility } from 'src/utils/common.utility';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async create(user: UserCreateDto) {
    const { username, email } = user;
    const password = CommonUtility.encryptBySalt(user.password);
    const newUser = this.userRepository.create({
      username,
      email,
      password,
    });
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updatePrimaryCurrency(userId: number, primaryCurrency: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('用戶不存在');
    }

    user.primaryCurrency = primaryCurrency;
    return this.userRepository.save(user);
  }

  async updateUserPreferences(userId: number, preferences: any) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('用戶不存在');
    }

    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
    return this.userRepository.save(user);
  }
}
