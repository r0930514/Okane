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
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';

@ApiTags('transactions')
@Controller('wallets/:walletId/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: '新增交易記錄' })
  @ApiParam({ name: 'walletId', description: '錢包 ID' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: '交易記錄建立成功',
  })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Param('walletId', ParseIntPipe) walletId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create(
      walletId,
      req.user.userId,
      createTransactionDto,
    );
  }

  @ApiOperation({ summary: '取得錢包的交易記錄' })
  @ApiParam({ name: 'walletId', description: '錢包 ID' })
  @ApiQuery({ name: 'page', description: '頁數', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: '每頁筆數', required: false, example: 20 })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得交易記錄列表',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByWallet(
    @Request() req: any,
    @Param('walletId', ParseIntPipe) walletId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.transactionService.findAllByWallet(
      walletId,
      req.user.userId,
      page || 1,
      limit || 20,
    );
  }

  @ApiOperation({ summary: '取得錢包的分類統計' })
  @ApiParam({ name: 'walletId', description: '錢包 ID' })
  @ApiQuery({ name: 'startDate', description: '開始日期', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: '結束日期', required: false, example: '2024-12-31' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得分類統計',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', example: '餐飲' },
          totalAmount: { type: 'number', example: 1200.50 },
          count: { type: 'number', example: 15 },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取' })
  @UseGuards(JwtAuthGuard)
  @Get('categories')
  getTransactionsByCategory(
    @Request() req: any,
    @Param('walletId', ParseIntPipe) walletId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.transactionService.getTransactionsByCategory(
      walletId,
      req.user.userId,
      start,
      end,
    );
  }
}

@ApiTags('transactions')
@Controller('transactions')
export class SingleTransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: '取得特定交易記錄' })
  @ApiParam({ name: 'id', description: '交易記錄 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得交易記錄詳細資訊',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 403, description: '無權限存取此交易記錄' })
  @ApiResponse({ status: 404, description: '交易記錄不存在' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: '更新交易記錄' })
  @ApiParam({ name: 'id', description: '交易記錄 ID' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '交易記錄更新成功',
  })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 403, description: '無權限存取此交易記錄' })
  @ApiResponse({ status: 404, description: '交易記錄不存在' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, req.user.userId, updateTransactionDto);
  }

  @ApiOperation({ summary: '刪除交易記錄' })
  @ApiParam({ name: 'id', description: '交易記錄 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '交易記錄刪除成功',
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 403, description: '無權限存取此交易記錄' })
  @ApiResponse({ status: 404, description: '交易記錄不存在' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.transactionService.remove(id, req.user.userId);
  }
}
