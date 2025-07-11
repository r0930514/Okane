import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { WalletModuleService } from './services/wallet-module.service';
import { WalletConfigService } from './services/wallet-config.service';
import { WalletService } from './services/wallet.service';
import { TransactionService } from './services/transaction.service';
import { WalletModuleController } from './controllers/wallet-module.controller';
import { WalletConfigController } from './controllers/wallet-config.controller';
import { WalletController } from './controllers/wallet.controller';
import {
  TransactionController,
  SingleTransactionController,
} from './controllers/transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [
    WalletModuleController,
    WalletConfigController,
    WalletController,
    TransactionController,
    SingleTransactionController,
  ],
  providers: [
    WalletModuleService,
    WalletConfigService,
    WalletService,
    TransactionService,
  ],
  exports: [
    WalletModuleService,
    WalletConfigService,
    WalletService,
    TransactionService,
  ],
})
export class WalletModule {}
