import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import {
  Account,
  BankAccount,
  CashAccount,
  CryptoAccount,
} from '../../entities/account.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionController } from './controllers/transaction.controller';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Account,
      BankAccount,
      CashAccount,
      CryptoAccount,
      Transaction,
    ]),
  ],
  controllers: [TransactionController, AccountController],
  providers: [TransactionService, AccountService],
  exports: [AccountService],
})
export class WalletModule {}
