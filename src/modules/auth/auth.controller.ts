import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UserCreateDto } from '../users/dto/user.create.dto';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { LocalStrategy } from './stratgies/local.stratgy';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Get('/test')
  test() {
    return 'test';
  }

  @Post('/signup')
  create(@Body() body: UserCreateDto) {
    return this.usersService.create(body);
  }

  @UseGuards(LocalStrategy)
  @Post('/signin')
  signin(@Req() request: Request) {
    return this.authService.login(request.body);
  }
}
