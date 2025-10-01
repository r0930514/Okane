import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import {
  Account,
  BankAccount,
  CashAccount,
  CryptoAccount,
  AccountType,
  AccountClassification,
  AccountStatus,
} from '../../../entities/account.entity';
import {
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
import {
  Transaction,
  TRANSACTION_TYPES,
} from '../../../entities/transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(CashAccount)
    private readonly cashAccountRepository: Repository<CashAccount>,
    @InjectRepository(CryptoAccount)
    private readonly cryptoAccountRepository: Repository<CryptoAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  private async createAndSaveInitialBalanceTransaction(
    account: Account,
    initialBalance?: number,
  ): Promise<void> {
    if (!initialBalance || initialBalance <= 0) {
      return;
    }

    const transaction = this.transactionRepository.create({
      amount: initialBalance,
      description: '期初餘額',
      account,
      metadata: {
        type: TRANSACTION_TYPES.INITIAL_BALANCE,
      },
    });
    await this.transactionRepository.save(transaction);
  }

  // 建立銀行帳戶
  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccount> {
    const account = this.bankAccountRepository.create({
      name: createBankAccountDto.name,
      balance: 0, // 初始餘額設為 0，由交易記錄決定
      currency: createBankAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      bankName: createBankAccountDto.bankName,
      accountNumber: createBankAccountDto.accountNumber,
    });

    const savedAccount = await this.bankAccountRepository.save(account);
    await this.createAndSaveInitialBalanceTransaction(
      savedAccount,
      createBankAccountDto.initialBalance,
    );
    return savedAccount;
  }

  // 建立現金帳戶
  async createCashAccount(
    createCashAccountDto: CreateCashAccountDto,
  ): Promise<CashAccount> {
    const account = this.cashAccountRepository.create({
      name: createCashAccountDto.name,
      balance: 0, // 初始餘額設為 0，由交易記錄決定
      currency: createCashAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      location: createCashAccountDto.location,
      notes: createCashAccountDto.notes,
    });

    const savedAccount = await this.cashAccountRepository.save(account);
    await this.createAndSaveInitialBalanceTransaction(
      savedAccount,
      createCashAccountDto.initialBalance,
    );
    return savedAccount;
  }

  // 建立加密貨幣帳戶
  async createCryptoAccount(
    createCryptoAccountDto: CreateCryptoAccountDto,
  ): Promise<CryptoAccount> {
    const account = this.cryptoAccountRepository.create({
      name: createCryptoAccountDto.name,
      balance: 0, // 初始餘額設為 0，由交易記錄決定
      currency: createCryptoAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      walletAddress: createCryptoAccountDto.walletAddress,
      network: createCryptoAccountDto.network,
      protocol: createCryptoAccountDto.protocol,
      publicKey: createCryptoAccountDto.publicKey,
      walletType: createCryptoAccountDto.walletType,
    });

    const savedAccount = await this.cryptoAccountRepository.save(account);
    await this.createAndSaveInitialBalanceTransaction(
      savedAccount,
      createCryptoAccountDto.initialBalance,
    );
    return savedAccount;
  }

  // 取得所有帳戶
  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { status: AccountStatus.ACTIVE } as FindOptionsWhere<Account>,
      order: { name: 'ASC' },
    });
  }

  // 取得所有特定類型帳戶的通用方法
  private async findAccountsByType<T extends Account>(
    repository: Repository<T>,
  ): Promise<T[]> {
    return await repository.find({
      where: { status: AccountStatus.ACTIVE } as FindOptionsWhere<T>,
      order: { name: 'ASC' } as FindOptionsOrder<T>,
    });
  }

  // 取得所有銀行帳戶
  async findBankAccounts(): Promise<BankAccount[]> {
    return this.findAccountsByType(this.bankAccountRepository);
  }

  // 取得所有現金帳戶
  async findCashAccounts(): Promise<CashAccount[]> {
    return this.findAccountsByType(this.cashAccountRepository);
  }

  // 取得所有加密貨幣帳戶
  async findCryptoAccounts(): Promise<CryptoAccount[]> {
    return this.findAccountsByType(this.cryptoAccountRepository);
  }

  // 根據 ID 取得帳戶
  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, status: AccountStatus.ACTIVE } as FindOptionsWhere<Account>,
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的帳戶`);
    }

    return account;
  }

  // 更新帳戶（通用）
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  // 更新特定類型帳戶的通用方法
  private async updateAccountByType<T extends Account>(
    id: string,
    updateDto: any,
    repository: Repository<T>,
    accountTypeName: string,
  ): Promise<T> {
    const account = await repository.findOne({
      where: { id, status: AccountStatus.ACTIVE } as any,
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的${accountTypeName}`);
    }

    Object.assign(account, updateDto);
    return await repository.save(account);
  }

  // 更新銀行帳戶
  async updateBankAccount(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {
    return this.updateAccountByType(
      id,
      updateBankAccountDto,
      this.bankAccountRepository,
      '銀行帳戶',
    );
  }

  // 更新現金帳戶
  async updateCashAccount(
    id: string,
    updateCashAccountDto: UpdateCashAccountDto,
  ): Promise<CashAccount> {
    return this.updateAccountByType(
      id,
      updateCashAccountDto,
      this.cashAccountRepository,
      '現金帳戶',
    );
  }

  // 更新加密貨幣帳戶
  async updateCryptoAccount(
    id: string,
    updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<CryptoAccount> {
    return this.updateAccountByType(
      id,
      updateCryptoAccountDto,
      this.cryptoAccountRepository,
      '加密貨幣帳戶',
    );
  }

  // 軟刪除帳戶
  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    account.status = AccountStatus.PENDING_DELETION;
    await this.accountRepository.save(account);
  }

  // 恢復已刪除的帳戶
  async restore(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        id,
        status: AccountStatus.PENDING_DELETION,
      } as FindOptionsWhere<Account>,
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的已刪除帳戶`);
    }

    account.status = AccountStatus.ACTIVE;
    return await this.accountRepository.save(account);
  }

  // 更新帳戶餘額（透過創建餘額調整交易記錄）
  async updateBalance(
    id: string,
    newBalance: number,
    adjustmentReason?: string,
  ): Promise<Account> {
    const account = await this.findOne(id);

    // 計算調整金額
    const adjustmentAmount = newBalance - account.balance;

    // 如果調整金額為 0，不需要創建交易
    if (adjustmentAmount === 0) {
      return account;
    }

    // 創建餘額調整交易記錄
    const adjustmentTransaction = this.transactionRepository.create({
      amount: adjustmentAmount,
      description: adjustmentReason || '餘額調整',
      account: account,
      metadata: {
        type: TRANSACTION_TYPES.BALANCE_ADJUSTMENT,
        previousBalance: account.balance,
        newBalance: newBalance,
      },
    });

    await this.transactionRepository.save(adjustmentTransaction);

    // 觸發器會自動更新餘額，重新查詢以獲取最新餘額
    return await this.findOne(id);
  }

  // 取得帳戶統計資料
  async getAccountStats(): Promise<{
    totalAccounts: number;
    bankAccounts: number;
    cashAccounts: number;
    cryptoAccounts: number;
    totalBalance: { [currency: string]: number };
  }> {
    const accounts = await this.findAll();

    const stats = {
      totalAccounts: accounts.length,
      bankAccounts: accounts.filter((a) => a.accountType === AccountType.BANK)
        .length,
      cashAccounts: accounts.filter((a) => a.accountType === AccountType.CASH)
        .length,
      cryptoAccounts: accounts.filter(
        (a) => a.accountType === AccountType.CRYPTO,
      ).length,
      totalBalance: {} as { [currency: string]: number },
    };

    // 計算各幣別總餘額
    accounts.forEach((account) => {
      if (!stats.totalBalance[account.currency]) {
        stats.totalBalance[account.currency] = 0;
      }
      stats.totalBalance[account.currency] += account.balance;
    });

    return stats;
  }
}
