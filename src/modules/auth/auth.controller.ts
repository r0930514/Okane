import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UserCreateDto } from '../users/dto/user.create.dto';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

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

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Req() request: Request) {
    return request.user;
  }
}
