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

  @ApiOperation({
    summary: '建立新錢包',
    description:
      '建立一個新的錢包，可指定名稱、帳號、顏色、初始餘額、主幣別、次要幣別等。\n\n- walletName: 錢包名稱，必填。\n- accountNumber: 帳戶號碼，選填。\n- walletType: 錢包類型，選填。\n- walletColor: 錢包顏色，選填。\n- initialBalance: 初始餘額，選填。\n- currency: 主幣別，選填，預設 TWD。\n- secondaryCurrency: 次要幣別，選填，預設空字串。',
  })
  @ApiBody({
    type: CreateWalletDto,
    description:
      '建立錢包時可傳入的欄位：\n- walletName: 錢包名稱，必填。\n- accountNumber: 帳戶號碼，選填。\n- walletType: 錢包類型，選填。\n- walletColor: 錢包顏色，選填。\n- initialBalance: 初始餘額，選填。\n- currency: 主幣別，選填，預設 TWD。\n- secondaryCurrency: 次要幣別，選填，預設空字串。',
    examples: {
      basic: {
        summary: '建立台幣錢包',
        value: {
          walletName: '現金錢包',
          currency: 'TWD',
          initialBalance: 1000,
          secondaryCurrency: 'USD',
        },
      },
      usd: {
        summary: '建立美元錢包',
        value: {
          walletName: '美金帳戶',
          currency: 'USD',
          initialBalance: 500,
          secondaryCurrency: 'TWD',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: '錢包建立成功，回傳錢包物件。',
  })
  @ApiResponse({
    status: 400,
    description: '請求資料格式錯誤，請檢查必填欄位與型別。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(req.user.userId, createWalletDto);
  }

  @ApiOperation({
    summary: '取得使用者的所有錢包',
    description: '取得目前登入使用者的所有錢包清單。',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包列表，回傳錢包陣列。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.walletService.findAllByUser(req.user.userId);
  }

  @ApiOperation({
    summary: '取得使用者所有錢包及餘額',
    description: '取得所有錢包及其即時餘額。',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包列表及餘額。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @UseGuards(JwtAuthGuard)
  @Get('with-balance')
  findAllWithBalance(@Request() req: any) {
    return this.walletService.getAllWalletsWithBalance(req.user.userId);
  }

  @ApiOperation({
    summary: '取得特定錢包詳細資訊',
    description: '取得指定錢包的詳細資訊與交易紀錄。可分頁查詢。',
  })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiQuery({
    name: 'page',
    description: '頁數，預設 1',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每頁筆數，預設 20',
    required: false,
    example: 20,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包詳細資訊，包含交易紀錄。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取。' })
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

  @ApiOperation({
    summary: '取得錢包餘額',
    description: '取得指定錢包的即時餘額。',
  })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '成功取得錢包餘額，回傳餘額與錢包名稱。',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 1500.5 },
        walletName: { type: 'string', example: '現金錢包' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取。' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/balance')
  getBalance(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.walletService.getBalance(id, req.user.userId);
  }

  @ApiOperation({
    summary: '更新錢包資訊',
    description:
      '可更新錢包名稱、帳號、顏色、初始餘額、主幣別、次要幣別等。\n\n注意：若錢包已有交易紀錄，建議謹慎更動主幣別（currency），以免影響歷史資料。',
  })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBody({
    type: UpdateWalletDto,
    description:
      '可更新欄位：\n- walletName: 錢包名稱\n- accountNumber: 帳戶號碼\n- walletType: 錢包類型\n- walletColor: 錢包顏色\n- initialBalance: 初始餘額\n- currency: 主幣別（如 TWD, USD, JPY）\n- secondaryCurrency: 次要幣別（如 TWD, USD, JPY）\n- operationMode: 操作模式',
    examples: {
      updateCurrency: {
        summary: '更新錢包主幣別',
        value: {
          currency: 'USD',
          secondaryCurrency: 'TWD',
        },
      },
      updateName: {
        summary: '更新錢包名稱',
        value: {
          walletName: '新錢包名稱',
        },
      },
      updateColor: {
        summary: '只改顏色',
        value: {
          walletColor: '#ff0000',
        },
      },
      updateBalance: {
        summary: '只改初始餘額',
        value: {
          initialBalance: 2000,
        },
      },
      updateMultiple: {
        summary: '同時更新多個欄位',
        value: {
          walletName: '多欄位測試',
          walletColor: '#00ff00',
          currency: 'JPY',
          secondaryCurrency: 'USD',
          initialBalance: 5000,
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包更新成功，回傳更新後的錢包物件。',
  })
  @ApiResponse({
    status: 400,
    description: '請求資料格式錯誤，請檢查必填欄位與型別。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取。' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(id, req.user.userId, updateWalletDto);
  }

  @ApiOperation({
    summary: '刪除錢包',
    description: '刪除指定錢包。',
  })
  @ApiParam({ name: 'id', description: '錢包 ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: '錢包刪除成功。',
  })
  @ApiResponse({ status: 401, description: '未授權，請帶入 JWT token。' })
  @ApiResponse({ status: 403, description: '無法刪除有交易記錄的錢包。' })
  @ApiResponse({ status: 404, description: '錢包不存在或無權限存取。' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.walletService.remove(id, req.user.userId);
  }
}
