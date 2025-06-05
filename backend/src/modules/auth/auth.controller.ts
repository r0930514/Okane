import { UserCreateDto } from '../users/dto/user.create.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from './stratgies/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '註冊新用戶' })
  @ApiBody({ type: UserCreateDto })
  @ApiResponse({
    status: 201,
    description: '用戶建立成功',
  })
  @ApiResponse({ status: 400, description: '請求資料驗證失敗' })
  @Post('/signup')
  create(@Body() body: UserCreateDto) {
    return this.usersService.create(body);
  }

  @ApiOperation({ summary: '驗證電子郵件' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          example: 'john@example.com',
          description: '用戶電子郵件',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '用戶存在',
    schema: {
      type: 'object',
      properties: {
        exists: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '用戶不存在，需要註冊' })
  @HttpCode(HttpStatus.OK)
  @Post('/verify-email')
  async verifyEmail(@Body() body: { email: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('用戶不存在，需要註冊');
    }
    return { exists: true };
  }

  @ApiOperation({ summary: '用戶登入' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'john@example.com',
          description: '用戶電子郵件',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: '用戶密碼',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '登入成功，返回 JWT token',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '登入驗證失敗' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Req() request: Request & { user: any }) {
    return this.authService.generateAccessToken(request.user);
  }

  @ApiOperation({ summary: '驗證 JWT Token' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '驗證成功，返回用戶資訊',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token 無效或已過期' })
  @UseGuards(JwtAuthGuard)
  @Get('/verifyToken')
  verify(@Req() request: Request & { user: any }) {
    return request.user;
  }
}
