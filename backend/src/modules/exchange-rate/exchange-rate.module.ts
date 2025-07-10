import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../../entities/exchange-rate.entity';
import { ExchangeRateProvider } from '../../entities/exchange-rate-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate, ExchangeRateProvider])],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
