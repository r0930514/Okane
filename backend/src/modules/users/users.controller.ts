import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/stratgies/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdatePrimaryCurrencyDto } from './dto/update-primary-currency.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('preferences')
  @ApiOperation({ summary: '取得用戶偏好設定' })
  @ApiResponse({ status: 200, description: '成功取得用戶偏好設定' })
  async getUserPreferences(@Request() req) {
    try {
      const userId = req.user.id;
      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new HttpException('用戶不存在', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          primaryCurrency: user.primaryCurrency,
          preferences: user.preferences,
        },
      };
    } catch {
      throw new HttpException(
        '取得用戶偏好設定失敗',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('primary-currency')
  @ApiOperation({ summary: '更新用戶主貨幣' })
  @ApiResponse({ status: 200, description: '成功更新主貨幣' })
  async updatePrimaryCurrency(
    @Request() req,
    @Body() updatePrimaryCurrencyDto: UpdatePrimaryCurrencyDto,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.usersService.updatePrimaryCurrency(
        userId,
        updatePrimaryCurrencyDto.primaryCurrency,
      );

      return {
        success: true,
        message: '主貨幣更新成功',
        data: result,
      };
    } catch {
      throw new HttpException(
        '更新主貨幣失敗',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('preferences')
  @ApiOperation({ summary: '更新用戶偏好設定' })
  @ApiResponse({ status: 200, description: '成功更新偏好設定' })
  async updateUserPreferences(
    @Request() req,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.usersService.updateUserPreferences(
        userId,
        updateUserPreferencesDto.preferences,
      );

      return {
        success: true,
        message: '偏好設定更新成功',
        data: result,
      };
    } catch {
      throw new HttpException(
        '更新偏好設定失敗',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
