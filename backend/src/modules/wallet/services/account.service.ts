import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  // 建立銀行帳戶
  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccount> {
    const account = this.bankAccountRepository.create({
      name: createBankAccountDto.name,
      balance: createBankAccountDto.balance,
      availableBalance: createBankAccountDto.balance,
      currency: createBankAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      bankName: createBankAccountDto.bankName,
      accountNumber: createBankAccountDto.accountNumber,
    });

    return await this.bankAccountRepository.save(account);
  }

  // 建立現金帳戶
  async createCashAccount(
    createCashAccountDto: CreateCashAccountDto,
  ): Promise<CashAccount> {
    const account = this.cashAccountRepository.create({
      name: createCashAccountDto.name,
      balance: createCashAccountDto.balance,
      availableBalance: createCashAccountDto.balance,
      currency: createCashAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      location: createCashAccountDto.location,
      notes: createCashAccountDto.notes,
    });

    return await this.cashAccountRepository.save(account);
  }

  // 建立加密貨幣帳戶
  async createCryptoAccount(
    createCryptoAccountDto: CreateCryptoAccountDto,
  ): Promise<CryptoAccount> {
    const account = this.cryptoAccountRepository.create({
      name: createCryptoAccountDto.name,
      balance: createCryptoAccountDto.balance,
      availableBalance: createCryptoAccountDto.balance,
      currency: createCryptoAccountDto.currency,
      classification: AccountClassification.ASSET,
      status: AccountStatus.ACTIVE,
      walletAddress: createCryptoAccountDto.walletAddress,
      network: createCryptoAccountDto.network,
      protocol: createCryptoAccountDto.protocol,
      publicKey: createCryptoAccountDto.publicKey,
      walletType: createCryptoAccountDto.walletType,
    });

    return await this.cryptoAccountRepository.save(account);
  }

  // 取得所有帳戶
  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { status: AccountStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // 取得所有銀行帳戶
  async findBankAccounts(): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { status: AccountStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // 取得所有現金帳戶
  async findCashAccounts(): Promise<CashAccount[]> {
    return await this.cashAccountRepository.find({
      where: { status: AccountStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // 取得所有加密貨幣帳戶
  async findCryptoAccounts(): Promise<CryptoAccount[]> {
    return await this.cryptoAccountRepository.find({
      where: { status: AccountStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // 根據 ID 取得帳戶
  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, status: AccountStatus.ACTIVE },
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

  // 更新銀行帳戶
  async updateBankAccount(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {
    const account = await this.bankAccountRepository.findOne({
      where: { id, status: AccountStatus.ACTIVE },
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的銀行帳戶`);
    }

    Object.assign(account, updateBankAccountDto);
    return await this.bankAccountRepository.save(account);
  }

  // 更新現金帳戶
  async updateCashAccount(
    id: string,
    updateCashAccountDto: UpdateCashAccountDto,
  ): Promise<CashAccount> {
    const account = await this.cashAccountRepository.findOne({
      where: { id, status: AccountStatus.ACTIVE },
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的現金帳戶`);
    }

    Object.assign(account, updateCashAccountDto);
    return await this.cashAccountRepository.save(account);
  }

  // 更新加密貨幣帳戶
  async updateCryptoAccount(
    id: string,
    updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<CryptoAccount> {
    const account = await this.cryptoAccountRepository.findOne({
      where: { id, status: AccountStatus.ACTIVE },
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的加密貨幣帳戶`);
    }

    Object.assign(account, updateCryptoAccountDto);
    return await this.cryptoAccountRepository.save(account);
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
      where: { id, status: AccountStatus.PENDING_DELETION },
    });

    if (!account) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的已刪除帳戶`);
    }

    account.status = AccountStatus.ACTIVE;
    return await this.accountRepository.save(account);
  }

  // 更新帳戶餘額
  async updateBalance(
    id: string,
    newBalance: number,
    newAvailableBalance?: number,
  ): Promise<Account> {
    const account = await this.findOne(id);

    account.balance = newBalance;
    account.availableBalance = newAvailableBalance ?? newBalance;

    return await this.accountRepository.save(account);
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
