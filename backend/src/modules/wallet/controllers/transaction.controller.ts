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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { Transaction } from '../../../entities/transaction.entity';

@ApiTags('交易管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: '建立新交易' })
  @ApiResponse({ status: 201, description: '交易建立成功', type: Transaction })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionService.create(createTransactionDto, req.user.id);
  }

  @Post('transfer')
  @ApiOperation({ summary: '建立轉帳交易' })
  @ApiResponse({ status: 201, description: '轉帳建立成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包不存在' })
  @ApiResponse({ status: 400, description: '不能轉帳到同一個錢包' })
  createTransfer(
    @Body() createTransferDto: CreateTransferDto,
    @Request() req: any,
  ) {
    return this.transactionService.createTransfer(
      createTransferDto.fromWalletId,
      createTransferDto.toWalletId,
      createTransferDto.amount,
      createTransferDto.description,
      req.user.id,
      createTransferDto.metadata,
    );
  }

  @Get()
  @ApiOperation({ summary: '取得交易列表' })
  @ApiQuery({
    name: 'walletId',
    required: false,
    description: '錢包識別碼篩選',
  })
  @ApiResponse({
    status: 200,
    description: '成功取得交易列表',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: '未授權' })
  findAll(@Request() req: any, @Query('walletId') walletId?: string) {
    return this.transactionService.findAll(req.user.id, walletId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: '根據分類取得交易' })
  @ApiParam({ name: 'category', description: '交易分類' })
  @ApiResponse({
    status: 200,
    description: '成功取得分類交易',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: '未授權' })
  findByCategory(@Param('category') category: string, @Request() req: any) {
    return this.transactionService.getTransactionsByCategory(
      req.user.id,
      category,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '取得特定交易詳細資訊' })
  @ApiParam({ name: 'id', description: '交易識別碼' })
  @ApiResponse({
    status: 200,
    description: '成功取得交易資訊',
    type: Transaction,
  })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '交易不存在' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.transactionService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新交易資訊' })
  @ApiParam({ name: 'id', description: '交易識別碼' })
  @ApiResponse({ status: 200, description: '交易更新成功', type: Transaction })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '交易不存在' })
  @ApiResponse({ status: 400, description: '不能直接更新轉帳交易金額' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionService.update(
      id,
      updateTransactionDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除交易' })
  @ApiParam({ name: 'id', description: '交易識別碼' })
  @ApiResponse({ status: 204, description: '交易刪除成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '交易不存在' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionService.remove(id, req.user.id);
  }
}
