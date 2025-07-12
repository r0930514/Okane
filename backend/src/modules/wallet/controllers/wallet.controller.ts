import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { WalletWithBalanceDto } from '../dto/wallet-with-balance.dto';
import { Wallet } from '../../../entities/wallet.entity';

@ApiTags('錢包管理')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: '建立新錢包' })
  @ApiResponse({ status: 201, description: '錢包建立成功', type: Wallet })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  create(@Body() createWalletDto: CreateWalletDto, @Request() req: any) {
    return this.walletService.create(createWalletDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '取得使用者所有錢包（包含餘額）' })
  @ApiResponse({
    status: 200,
    description: '成功取得錢包列表（包含餘額資訊）',
    type: [WalletWithBalanceDto],
  })
  @ApiResponse({ status: 401, description: '未授權' })
  findAll(@Request() req: any) {
    return this.walletService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '取得特定錢包詳細資訊（包含餘額）' })
  @ApiParam({ name: 'id', description: '錢包識別碼' })
  @ApiResponse({
    status: 200,
    description: '成功取得錢包資訊（包含餘額）',
    type: WalletWithBalanceDto,
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.walletService.findOne(id, req.user.id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: '取得錢包餘額' })
  @ApiParam({ name: 'id', description: '錢包識別碼' })
  @ApiResponse({ status: 200, description: '成功取得錢包餘額' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  getBalance(@Param('id') id: string, @Request() req: any) {
    return this.walletService.getBalance(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新錢包資訊' })
  @ApiParam({ name: 'id', description: '錢包識別碼' })
  @ApiResponse({ status: 200, description: '錢包更新成功', type: Wallet })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Request() req: any,
  ) {
    return this.walletService.update(id, updateWalletDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除錢包' })
  @ApiParam({ name: 'id', description: '錢包識別碼' })
  @ApiResponse({ status: 204, description: '錢包刪除成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.walletService.remove(id, req.user.id);
  }
}
