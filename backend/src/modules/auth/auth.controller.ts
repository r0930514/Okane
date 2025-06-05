import { UserCreateDto } from '../users/dto/user.create.dto';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './stratgies/jwt-auth.guard';

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

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Req() request: Request) {
    return this.authService.generateAccessToken(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verifyToken')
  verify(@Req() request) {
    return request.user;
  }

  @Get('/verifyEmail/:email')
  async verifyEmail(@Param('email') email: string) {
    const result = await this.usersService.findByEmail(email);
    if (!result) {
      throw new NotFoundException();
    }
  }
}
