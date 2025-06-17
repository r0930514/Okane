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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: '建立新錢包' })
  @ApiBody({ type: CreateWalletDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: '錢包建立成功',
  })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.walletService.create(req.user.userId, createWalletDto);
  }

  @ApiOperation({ summary: '取得使用者的所有錢包' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包列表',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.walletService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: '取得使用者所有錢包及餘額' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包列表及餘額',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @UseGuards(JwtAuthGuard)
  @Get('with-balance')
  findAllWithBalance(@Request() req: any) {
    return this.walletService.getAllWalletsWithBalance(req.user.userId);
  }

  @ApiOperation({ summary: '取得特定錢包詳細資訊' })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiQuery({ name: 'page', description: '頁數', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: '每頁筆數', required: false, example: 20 })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包詳細資訊',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.walletService.getWalletWithTransactions(
      id,
      req.user.userId,
      page || 1,
      limit || 20,
    );
  }

  @ApiOperation({ summary: '取得錢包餘額' })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包餘額',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 1500.50 },
        walletName: { type: 'string', example: '現金錢包' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/balance')
  getBalance(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletService.getBalance(id, req.user.userId);
  }

  @ApiOperation({ summary: '更新錢包資訊' })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBody({ type: UpdateWalletDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包更新成功',
  })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(id, req.user.userId, updateWalletDto);
  }

  @ApiOperation({ summary: '刪除錢包' })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包刪除成功',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 403, description: '無法刪除有交易記錄的錢包' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.walletService.remove(id, req.user.userId);
  }
}
