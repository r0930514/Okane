import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from 'src/models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers(): string {
    return 'All users';
  }
  @Post()
  create(@Body() body: UserDocument) {
    return this.usersService.create(body);
  }
}
