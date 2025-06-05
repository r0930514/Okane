import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { CommonUtility } from 'src/utils/common.utility';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  create(user: UserCreateDto) {
    const { username, email } = user;
    const password = CommonUtility.encryptBySalt(user.password);
    return this.userModel.create({
      username,
      email,
      password,
    });
  }
  findByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }
}
