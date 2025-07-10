import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExchangeRateService } from './exchange-rate.service';
import { JwtAuthGuard } from '../auth/stratgies/jwt-auth.guard';

@ApiTags('exchange-rates')
@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('latest')
  @ApiOperation({ summary: '取得最新匯率' })
  @ApiQuery({ name: 'from', description: '來源貨幣', example: 'USD' })
  @ApiQuery({ name: 'to', description: '目標貨幣', example: 'TWD' })
  @ApiQuery({ name: 'providerId', description: '供應商ID', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: '成功取得匯率' })
  async getLatestRate(
    @Query('from') fromCurrency: string,
    @Query('to') toCurrency: string,
    @Query('providerId') providerId?: number,
  ) {
    const rate = await this.exchangeRateService.getLatestRate(
      fromCurrency,
      toCurrency,
      providerId,
    );
    return {
      success: true,
      data: rate,
    };
  }

  @Get('multi-provider')
  @ApiOperation({ summary: '取得多個供應商的匯率比較' })
  @ApiQuery({ name: 'from', description: '來源貨幣', example: 'USD' })
  @ApiQuery({ name: 'to', description: '目標貨幣', example: 'TWD' })
  @ApiQuery({ name: 'limit', description: '限制回傳數量', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: '成功取得多供應商匯率' })
  async getMultiProviderRates(
    @Query('from') fromCurrency: string,
    @Query('to') toCurrency: string,
    @Query('limit') limit = 5,
  ) {
    const rates = await this.exchangeRateService.getMultiProviderRates(
      fromCurrency,
      toCurrency,
      limit,
    );
    return {
      success: true,
      data: rates,
    };
  }

  @Post('convert')
  @ApiOperation({ summary: '轉換金額' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功轉換金額' })
  async convertAmount(
    @Body()
    convertRequest: {
      amount: number;
      fromCurrency: string;
      toCurrency: string;
      providerId?: number;
    },
  ) {
    const { amount, fromCurrency, toCurrency, providerId } = convertRequest;
    const result = await this.exchangeRateService.convertAmount(
      amount,
      fromCurrency,
      toCurrency,
      providerId,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('batch-convert')
  @ApiOperation({ summary: '批次轉換金額到指定貨幣' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功批次轉換' })
  async batchConvertToTargetCurrency(
    @Body()
    batchRequest: {
      amounts: Array<{ amount: number; currency: string }>;
      targetCurrency: string;
    },
  ) {
    const { amounts, targetCurrency } = batchRequest;
    const result = await this.exchangeRateService.batchConvertToTargetCurrency(
      amounts,
      targetCurrency,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('initialize-fake-data')
  @ApiOperation({ summary: '初始化假資料 (僅開發環境)' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功初始化假資料' })
  async initializeFakeData() {
    await this.exchangeRateService.initializeFakeData();
    return {
      success: true,
      message: 'Fake data initialized successfully',
    };
  }
}
