import { Injectable } from '@nestjs/common';
import { CommonUtility } from 'src/utils/common.utility';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByEmail({ username });
    if (!user) {
      return null;
    }
    const { hash } = CommonUtility.encryptBySalt(password, user.password.salt);
    return hash === user.password.hash ? user : null;
  }
}
