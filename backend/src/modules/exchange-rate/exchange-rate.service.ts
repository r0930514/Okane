import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../../entities/exchange-rate.entity';
import { ExchangeRateProvider } from '../../entities/exchange-rate-provider.entity';

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);

  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(ExchangeRateProvider)
    private providerRepository: Repository<ExchangeRateProvider>,
  ) {}

  /**
   * 取得最新匯率
   * @param fromCurrency 來源貨幣
   * @param toCurrency 目標貨幣
   * @param providerId 指定供應商ID (可選)
   * @returns 最新匯率
   */
  async getLatestRate(
    fromCurrency: string,
    toCurrency: string,
    providerId?: number,
  ): Promise<ExchangeRate | null> {
    if (fromCurrency === toCurrency) {
      // 相同貨幣回傳1.0的虛擬匯率
      return this.createVirtualRate(fromCurrency, toCurrency, 1.0);
    }

    const queryBuilder = this.exchangeRateRepository
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.provider', 'provider')
      .where('rate.fromCurrency = :fromCurrency', { fromCurrency })
      .andWhere('rate.toCurrency = :toCurrency', { toCurrency })
      .andWhere('provider.isActive = true');

    if (providerId) {
      queryBuilder.andWhere('rate.providerId = :providerId', { providerId });
    }

    const rate = await queryBuilder.orderBy('rate.timestamp', 'DESC').getOne();

    if (!rate) {
      this.logger.warn(
        `No exchange rate found for ${fromCurrency} to ${toCurrency}`,
      );
    }

    return rate;
  }

  /**
   * 取得多個供應商的匯率比較
   * @param fromCurrency 來源貨幣
   * @param toCurrency 目標貨幣
   * @param limit 限制回傳數量
   * @returns 匯率比較列表
   */
  async getMultiProviderRates(
    fromCurrency: string,
    toCurrency: string,
    limit = 5,
  ): Promise<ExchangeRate[]> {
    if (fromCurrency === toCurrency) {
      return [this.createVirtualRate(fromCurrency, toCurrency, 1.0)];
    }

    const rates = await this.exchangeRateRepository
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.provider', 'provider')
      .where('rate.fromCurrency = :fromCurrency', { fromCurrency })
      .andWhere('rate.toCurrency = :toCurrency', { toCurrency })
      .andWhere('provider.isActive = true')
      .andWhere('rate.timestamp > :threshold', {
        threshold: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小時內
      })
      .orderBy('provider.priority', 'ASC')
      .addOrderBy('rate.timestamp', 'DESC')
      .limit(limit)
      .getMany();

    return rates;
  }

  /**
   * 轉換金額
   * @param amount 金額
   * @param fromCurrency 來源貨幣
   * @param toCurrency 目標貨幣
   * @param providerId 指定供應商ID
   * @returns 轉換後的金額和使用的匯率
   */
  async convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    providerId?: number,
  ): Promise<{ convertedAmount: number; rate: ExchangeRate }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const rate = await this.getLatestRate(fromCurrency, toCurrency, providerId);
    if (!rate) {
      throw new NotFoundException(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`,
      );
    }

    const convertedAmount = amount * Number(rate.rate);
    return { convertedAmount, rate };
  }

  /**
   * 批次轉換金額到指定貨幣
   * @param amounts 金額陣列 { amount: number, currency: string }
   * @param targetCurrency 目標貨幣
   * @returns 轉換後的總金額
   */
  async batchConvertToTargetCurrency(
    amounts: Array<{ amount: number; currency: string }>,
    targetCurrency: string,
  ): Promise<{
    totalAmount: number;
    conversions: Array<{
      originalAmount: number;
      originalCurrency: string;
      convertedAmount: number;
      rate: number;
    }>;
  }> {
    const conversions = [];
    let totalAmount = 0;

    for (const { amount, currency } of amounts) {
      if (currency === targetCurrency) {
        conversions.push({
          originalAmount: amount,
          originalCurrency: currency,
          convertedAmount: amount,
          rate: 1.0,
        });
        totalAmount += amount;
      } else {
        const result = await this.convertAmount(
          amount,
          currency,
          targetCurrency,
        );
        conversions.push({
          originalAmount: amount,
          originalCurrency: currency,
          convertedAmount: result.convertedAmount,
          rate: Number(result.rate.rate),
        });
        totalAmount += result.convertedAmount;
      }
    }

    return { totalAmount, conversions };
  }

  /**
   * 更新匯率 (目前使用假資料)
   * @param fromCurrency 來源貨幣
   * @param toCurrency 目標貨幣
   * @param rate 匯率
   * @param providerId 供應商ID
   * @returns 更新後的匯率記錄
   */
  async updateRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    providerId: number,
  ): Promise<ExchangeRate> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Exchange rate provider not found');
    }

    const exchangeRate = this.exchangeRateRepository.create({
      fromCurrency,
      toCurrency,
      rate,
      timestamp: new Date(),
      provider,
      providerId,
      rateType: 'mid',
    });

    return this.exchangeRateRepository.save(exchangeRate);
  }

  /**
   * 初始化假資料
   */
  async initializeFakeData(): Promise<void> {
    // 檢查是否已有資料
    const providerCount = await this.providerRepository.count();
    if (providerCount > 0) {
      this.logger.log(
        'Exchange rate data already exists, skipping initialization',
      );
      return;
    }

    // 創建假供應商
    const providers = await this.providerRepository.save([
      {
        name: 'mock_bank',
        displayName: '模擬銀行',
        description: '模擬銀行匯率供應商',
        isActive: true,
        priority: 1,
        reliabilityScore: 95,
      },
      {
        name: 'mock_exchange',
        displayName: '模擬交易所',
        description: '模擬加密貨幣交易所',
        isActive: true,
        priority: 2,
        reliabilityScore: 90,
      },
    ]);

    // 創建假匯率資料
    const exchangeRates = [
      // 法幣匯率
      { from: 'USD', to: 'TWD', rate: 31.2, providerId: providers[0].id },
      { from: 'TWD', to: 'USD', rate: 0.032, providerId: providers[0].id },
      { from: 'EUR', to: 'TWD', rate: 33.5, providerId: providers[0].id },
      { from: 'TWD', to: 'EUR', rate: 0.0298, providerId: providers[0].id },
      { from: 'JPY', to: 'TWD', rate: 0.21, providerId: providers[0].id },
      { from: 'TWD', to: 'JPY', rate: 4.76, providerId: providers[0].id },

      // 加密貨幣匯率
      { from: 'USDT', to: 'TWD', rate: 31.0, providerId: providers[1].id },
      { from: 'TWD', to: 'USDT', rate: 0.0323, providerId: providers[1].id },
      { from: 'BTC', to: 'TWD', rate: 1350000, providerId: providers[1].id },
      { from: 'TWD', to: 'BTC', rate: 0.00000074, providerId: providers[1].id },
      { from: 'ETH', to: 'TWD', rate: 85000, providerId: providers[1].id },
      { from: 'TWD', to: 'ETH', rate: 0.0000118, providerId: providers[1].id },
    ];

    for (const rateData of exchangeRates) {
      await this.exchangeRateRepository.save({
        fromCurrency: rateData.from,
        toCurrency: rateData.to,
        rate: rateData.rate,
        timestamp: new Date(),
        providerId: rateData.providerId,
        rateType: 'mid',
      });
    }

    this.logger.log('Fake exchange rate data initialized successfully');
  }

  /**
   * 創建虛擬匯率記錄 (用於相同貨幣)
   */
  private createVirtualRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
  ): ExchangeRate {
    const virtualRate = new ExchangeRate();
    virtualRate.fromCurrency = fromCurrency;
    virtualRate.toCurrency = toCurrency;
    virtualRate.rate = rate;
    virtualRate.timestamp = new Date();
    virtualRate.rateType = 'mid';
    // 不設定 provider 表示這是虛擬匯率
    return virtualRate;
  }
}
