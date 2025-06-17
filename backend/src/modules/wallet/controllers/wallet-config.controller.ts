import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WalletConfigService } from '../services/wallet-config.service';
import { CreateWalletConfigDto } from '../dto/create-wallet-config.dto';
import { UpdateWalletConfigDto } from '../dto/update-wallet-config.dto';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';

@ApiTags('wallet-configs')
@Controller('wallet-configs')
export class WalletConfigController {
  constructor(private readonly walletConfigService: WalletConfigService) {}

  @ApiOperation({ summary: '建立新錢包設定檔' })
  @ApiBody({ type: CreateWalletConfigDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: '錢包設定檔建立成功',
  })
  @ApiResponse({
    status: 400,
    description: '請求資料格式錯誤或設定格式不符合模組要求',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包模組不存在' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Body() createWalletConfigDto: CreateWalletConfigDto,
  ) {
    return this.walletConfigService.create(
      req.user.userId,
      createWalletConfigDto,
    );
  }

  @ApiOperation({ summary: '取得使用者的所有錢包設定檔' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包設定檔列表',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.walletConfigService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: '取得特定錢包設定檔' })
  @ApiParam({ name: 'id', description: '錢包設定檔 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包設定檔資訊',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包設定檔不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.walletConfigService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: '更新錢包設定檔' })
  @ApiParam({ name: 'id', description: '錢包設定檔 ID' })
  @ApiBody({ type: UpdateWalletConfigDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包設定檔更新成功',
  })
  @ApiResponse({
    status: 400,
    description: '請求資料格式錯誤或設定格式不符合模組要求',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包設定檔不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletConfigDto: UpdateWalletConfigDto,
  ) {
    return this.walletConfigService.update(
      id,
      req.user.userId,
      updateWalletConfigDto,
    );
  }

  @ApiOperation({ summary: '刪除錢包設定檔' })
  @ApiParam({ name: 'id', description: '錢包設定檔 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包設定檔刪除成功',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包設定檔不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.walletConfigService.remove(id, req.user.userId);
  }
}
