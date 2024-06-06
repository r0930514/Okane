import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user.create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers(): string {
    return 'All users';
  }
  @Post()
  create(@Body() body: UserCreateDto) {
    return this.usersService.create(body);
  }
}
