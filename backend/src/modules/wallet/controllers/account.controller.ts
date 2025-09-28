import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AccountService } from '../services/account.service';
import { Account, AccountType } from '../../../entities/account.entity';
import {
  CreateAccountDto,
  CreateBankAccountDto,
  CreateCashAccountDto,
  CreateCryptoAccountDto,
} from '../dto/create-account.dto';
import {
  UpdateAccountDto,
  UpdateBankAccountDto,
  UpdateCashAccountDto,
  UpdateCryptoAccountDto,
} from '../dto/update-account.dto';

@ApiTags('帳戶管理')
@Controller('accounts')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // 取消註釋以啟用認證
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 建立帳戶 - 通用方法
  @Post()
  @ApiOperation({ summary: '建立新帳戶' })
  @ApiResponse({
    status: 201,
    description: '帳戶建立成功',
    type: Account,
  })
  @ApiResponse({ status: 400, description: '請求資料無效' })
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return await this.accountService.createAccount(createAccountDto);
  }

  // 建立銀行帳戶
  @Post('bank')
  @ApiOperation({ summary: '建立銀行帳戶' })
  @ApiResponse({
    status: 201,
    description: '銀行帳戶建立成功',
    type: Account,
  })
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<Account> {
    return await this.accountService.createBankAccount(createBankAccountDto);
  }

  // 建立現金帳戶
  @Post('cash')
  @ApiOperation({ summary: '建立現金帳戶' })
  @ApiResponse({
    status: 201,
    description: '現金帳戶建立成功',
    type: Account,
  })
  async createCashAccount(
    @Body() createCashAccountDto: CreateCashAccountDto,
  ): Promise<Account> {
    return await this.accountService.createCashAccount(createCashAccountDto);
  }

  // 建立加密貨幣帳戶
  @Post('crypto')
  @ApiOperation({ summary: '建立加密貨幣帳戶' })
  @ApiResponse({
    status: 201,
    description: '加密貨幣帳戶建立成功',
    type: Account,
  })
  async createCryptoAccount(
    @Body() createCryptoAccountDto: CreateCryptoAccountDto,
  ): Promise<Account> {
    return await this.accountService.createCryptoAccount(
      createCryptoAccountDto,
    );
  }

  // 取得所有帳戶
  @Get()
  @ApiOperation({ summary: '取得所有帳戶' })
  @ApiQuery({
    name: 'type',
    enum: AccountType,
    required: false,
    description: '依帳戶類型篩選',
  })
  @ApiResponse({
    status: 200,
    description: '成功取得帳戶清單',
    type: [Account],
  })
  async findAll(@Query('type') type?: AccountType): Promise<Account[]> {
    if (type) {
      return await this.accountService.findByType(type);
    }
    return await this.accountService.findAll();
  }

  // 取得銀行帳戶
  @Get('bank')
  @ApiOperation({ summary: '取得所有銀行帳戶' })
  @ApiResponse({
    status: 200,
    description: '成功取得銀行帳戶清單',
    type: [Account],
  })
  async findBankAccounts(): Promise<Account[]> {
    return await this.accountService.findBankAccounts();
  }

  // 取得現金帳戶
  @Get('cash')
  @ApiOperation({ summary: '取得所有現金帳戶' })
  @ApiResponse({
    status: 200,
    description: '成功取得現金帳戶清單',
    type: [Account],
  })
  async findCashAccounts(): Promise<Account[]> {
    return await this.accountService.findCashAccounts();
  }

  // 取得加密貨幣帳戶
  @Get('crypto')
  @ApiOperation({ summary: '取得所有加密貨幣帳戶' })
  @ApiResponse({
    status: 200,
    description: '成功取得加密貨幣帳戶清單',
    type: [Account],
  })
  async findCryptoAccounts(): Promise<Account[]> {
    return await this.accountService.findCryptoAccounts();
  }

  // 取得帳戶統計
  @Get('stats')
  @ApiOperation({ summary: '取得帳戶統計資料' })
  @ApiResponse({
    status: 200,
    description: '成功取得帳戶統計資料',
  })
  async getStats() {
    return await this.accountService.getAccountStats();
  }

  // 根據 ID 取得帳戶
  @Get(':id')
  @ApiOperation({ summary: '根據 ID 取得帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '成功取得帳戶',
    type: Account,
  })
  @ApiResponse({ status: 404, description: '帳戶不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Account> {
    return await this.accountService.findOne(id);
  }

  // 更新帳戶 - 通用方法
  @Put(':id')
  @ApiOperation({ summary: '更新帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '帳戶更新成功',
    type: Account,
  })
  @ApiResponse({ status: 404, description: '帳戶不存在' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountService.update(id, updateAccountDto);
  }

  // 更新銀行帳戶
  @Put(':id/bank')
  @ApiOperation({ summary: '更新銀行帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '銀行帳戶更新成功',
    type: Account,
  })
  async updateBankAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<Account> {
    return await this.accountService.updateBankAccount(
      id,
      updateBankAccountDto,
    );
  }

  // 更新現金帳戶
  @Put(':id/cash')
  @ApiOperation({ summary: '更新現金帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '現金帳戶更新成功',
    type: Account,
  })
  async updateCashAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCashAccountDto: UpdateCashAccountDto,
  ): Promise<Account> {
    return await this.accountService.updateCashAccount(
      id,
      updateCashAccountDto,
    );
  }

  // 更新加密貨幣帳戶
  @Put(':id/crypto')
  @ApiOperation({ summary: '更新加密貨幣帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '加密貨幣帳戶更新成功',
    type: Account,
  })
  async updateCryptoAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<Account> {
    return await this.accountService.updateCryptoAccount(
      id,
      updateCryptoAccountDto,
    );
  }

  // 更新帳戶餘額
  @Put(':id/balance')
  @ApiOperation({ summary: '更新帳戶餘額' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '帳戶餘額更新成功',
    type: Account,
  })
  async updateBalance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() balanceData: { balance: number; availableBalance?: number },
  ): Promise<Account> {
    return await this.accountService.updateBalance(
      id,
      balanceData.balance,
      balanceData.availableBalance,
    );
  }

  // 刪除帳戶（軟刪除）
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '刪除帳戶（軟刪除）' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({ status: 204, description: '帳戶刪除成功' })
  @ApiResponse({ status: 404, description: '帳戶不存在' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.accountService.remove(id);
  }

  // 恢復已刪除的帳戶
  @Put(':id/restore')
  @ApiOperation({ summary: '恢復已刪除的帳戶' })
  @ApiParam({
    name: 'id',
    description: '帳戶 UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '帳戶恢復成功',
    type: Account,
  })
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<Account> {
    return await this.accountService.restore(id);
  }
}
