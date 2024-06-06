import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreateDto } from '../users/dto/user.create.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/test')
  test() {
    return 'test';
  }
  @Post('/signup')
  create(@Body() body: UserCreateDto) {
    return this.usersService.create(body);
  }
}
