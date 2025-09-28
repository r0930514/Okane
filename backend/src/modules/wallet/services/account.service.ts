import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Account,
  AccountType,
  AccountClassification,
  AccountStatus,
} from '../../../entities/account.entity';
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

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // 通用建立帳戶方法
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      name: createAccountDto.name,
      balance: createAccountDto.balance,
      availableBalance: createAccountDto.availableBalance,
      currency: createAccountDto.currency,
      classification: createAccountDto.classification,
      type: createAccountDto.type,
      status: AccountStatus.ACTIVE,
      accountableData: createAccountDto.accountableData || null,
    });

    return await this.accountRepository.save(account);
  }

  // 建立銀行帳戶
  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<Account> {
    const account = this.accountRepository.create({
      name: createBankAccountDto.name,
      balance: createBankAccountDto.balance,
      availableBalance: createBankAccountDto.balance, // 預設可用餘額等於餘額
      currency: createBankAccountDto.currency,
      classification: AccountClassification.ASSET,
      type: AccountType.BANK,
      status: AccountStatus.ACTIVE,
      accountableData: createBankAccountDto.bankData,
    });

    return await this.accountRepository.save(account);
  }

  // 建立現金帳戶
  async createCashAccount(
    createCashAccountDto: CreateCashAccountDto,
  ): Promise<Account> {
    const account = this.accountRepository.create({
      name: createCashAccountDto.name,
      balance: createCashAccountDto.balance,
      availableBalance: createCashAccountDto.balance,
      currency: createCashAccountDto.currency,
      classification: AccountClassification.ASSET,
      type: AccountType.CASH,
      status: AccountStatus.ACTIVE,
      accountableData: createCashAccountDto.cashData || null,
    });

    return await this.accountRepository.save(account);
  }

  // 建立加密貨幣帳戶
  async createCryptoAccount(
    createCryptoAccountDto: CreateCryptoAccountDto,
  ): Promise<Account> {
    const account = this.accountRepository.create({
      name: createCryptoAccountDto.name,
      balance: createCryptoAccountDto.balance,
      availableBalance: createCryptoAccountDto.balance,
      currency: createCryptoAccountDto.currency,
      classification: AccountClassification.ASSET,
      type: AccountType.CRYPTO,
      status: AccountStatus.ACTIVE,
      accountableData: createCryptoAccountDto.cryptoData,
    });

    return await this.accountRepository.save(account);
  }

  // 取得所有帳戶
  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { status: AccountStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  // 根據類型取得帳戶
  async findByType(type: AccountType): Promise<Account[]> {
    return await this.accountRepository.find({
      where: {
        type,
        status: AccountStatus.ACTIVE,
      },
      order: { name: 'ASC' },
    });
  }

  // 取得所有銀行帳戶
  async findBankAccounts(): Promise<Account[]> {
    return await this.findByType(AccountType.BANK);
  }

  // 取得所有現金帳戶
  async findCashAccounts(): Promise<Account[]> {
    return await this.findByType(AccountType.CASH);
  }

  // 取得所有加密貨幣帳戶
  async findCryptoAccounts(): Promise<Account[]> {
    return await this.findByType(AccountType.CRYPTO);
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

  // 更新帳戶
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);

    // 更新基本資料
    if (updateAccountDto.name !== undefined) {
      account.name = updateAccountDto.name;
    }
    if (updateAccountDto.balance !== undefined) {
      account.balance = updateAccountDto.balance;
    }
    if (updateAccountDto.availableBalance !== undefined) {
      account.availableBalance = updateAccountDto.availableBalance;
    }
    if (updateAccountDto.currency !== undefined) {
      account.currency = updateAccountDto.currency;
    }
    if (updateAccountDto.classification !== undefined) {
      account.classification = updateAccountDto.classification;
    }
    if (updateAccountDto.status !== undefined) {
      account.status = updateAccountDto.status;
    }

    // 更新特定類型資料
    if (updateAccountDto.accountableData !== undefined) {
      account.accountableData = {
        ...account.accountableData,
        ...updateAccountDto.accountableData,
      };
    }

    return await this.accountRepository.save(account);
  }

  // 更新銀行帳戶
  async updateBankAccount(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);

    if (account.type !== AccountType.BANK) {
      throw new BadRequestException('此帳戶不是銀行帳戶類型');
    }

    return await this.update(id, {
      ...updateBankAccountDto,
      accountableData: updateBankAccountDto.bankData,
    });
  }

  // 更新現金帳戶
  async updateCashAccount(
    id: string,
    updateCashAccountDto: UpdateCashAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);

    if (account.type !== AccountType.CASH) {
      throw new BadRequestException('此帳戶不是現金帳戶類型');
    }

    return await this.update(id, {
      ...updateCashAccountDto,
      accountableData: updateCashAccountDto.cashData,
    });
  }

  // 更新加密貨幣帳戶
  async updateCryptoAccount(
    id: string,
    updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);

    if (account.type !== AccountType.CRYPTO) {
      throw new BadRequestException('此帳戶不是加密貨幣帳戶類型');
    }

    return await this.update(id, {
      ...updateCryptoAccountDto,
      accountableData: updateCryptoAccountDto.cryptoData,
    });
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
      bankAccounts: accounts.filter((a) => a.type === AccountType.BANK).length,
      cashAccounts: accounts.filter((a) => a.type === AccountType.CASH).length,
      cryptoAccounts: accounts.filter((a) => a.type === AccountType.CRYPTO)
        .length,
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
