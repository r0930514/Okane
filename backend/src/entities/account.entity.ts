import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountClassification {
  ASSET = 'asset',
  LIABILITY = 'liability',
}

export enum AccountStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  DISABLED = 'disabled',
  PENDING_DELETION = 'pending_deletion',
}

export enum AccountType {
  BANK = 'bank', // 銀行帳戶
  CASH = 'cash', // 手頭現金
  CRYPTO = 'crypto', // 加密貨幣帳戶
}

export enum BalanceType {
  CASH = 'cash',
  NON_CASH = 'non_cash',
  INVESTMENT = 'investment',
}

// 型別定義各類型的 accountableData
export interface BankAccountData {
  bankName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;
  bankAddress?: string;
}

export interface CashAccountData {
  location?: string; // 存放位置（如：錢包、保險箱）
  notes?: string; // 備註
}

export interface CryptoAccountData {
  walletAddress: string;
  network: string; // Bitcoin, Ethereum, Polygon 等
  protocol?: string; // ERC-20, BEP-20, TRC-20 等
  publicKey?: string;
  walletType?: string; // hardware, software, exchange
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the account' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the account' })
  name: string;

  @Column('decimal', { precision: 15, scale: 2 })
  @ApiProperty({ description: 'Balance of the account' })
  balance: number;

  @Column('decimal', { precision: 15, scale: 2 })
  @ApiProperty({ description: 'Available balance of the account' })
  availableBalance: number;

  @Column({ length: 3 })
  @ApiProperty({ description: 'Currency code of the account (e.g., USD, EUR)' })
  currency: string;

  @Column({
    type: 'enum',
    enum: AccountClassification,
    nullable: true,
  })
  @ApiProperty({
    description: 'Classification of the account',
    enum: AccountClassification,
  })
  classification: AccountClassification;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @ApiProperty({ description: 'Status of the account', enum: AccountStatus })
  status: AccountStatus;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  @ApiProperty({
    description: '帳戶類型',
    enum: AccountType,
    example: AccountType.BANK,
  })
  type: AccountType;

  @Column('jsonb', { nullable: true })
  @ApiProperty({
    description: '帳戶類型特定資料',
    example: {
      bankName: '台新銀行',
      accountNumber: '1234567890',
      branchCode: 'TSB001',
    },
  })
  accountableData: BankAccountData | CashAccountData | CryptoAccountData | null;

  @ApiProperty({
    description: '帳戶所有者',
    type: () => 'User',
  })
  @ManyToOne('User', 'accounts')
  user: any; // 使用 any 避免循環引用

  @ApiProperty({
    description: '帳戶的交易記錄',
    type: () => ['Transaction'],
  })
  @OneToMany('Transaction', 'account')
  transactions: any[]; // 使用 any 避免循環引用

  get balanceType(): BalanceType {
    switch (this.type) {
      case AccountType.BANK:
      case AccountType.CASH:
        return BalanceType.CASH;
      case AccountType.CRYPTO:
        return BalanceType.INVESTMENT;
      default:
        throw new Error(`Unknown account type: ${this.type}`);
    }
  }

  // 型別安全的 getter 方法
  get bankData(): BankAccountData | null {
    return this.type === AccountType.BANK
      ? (this.accountableData as BankAccountData)
      : null;
  }

  get cashData(): CashAccountData | null {
    return this.type === AccountType.CASH
      ? (this.accountableData as CashAccountData)
      : null;
  }

  get cryptoData(): CryptoAccountData | null {
    return this.type === AccountType.CRYPTO
      ? (this.accountableData as CryptoAccountData)
      : null;
  }

  // 便利方法：取得特定類型的顯示名稱
  get typeDisplayName(): string {
    switch (this.type) {
      case AccountType.BANK:
        return '銀行帳戶';
      case AccountType.CASH:
        return '現金';
      case AccountType.CRYPTO:
        return '加密貨幣';
      default:
        return '未知類型';
    }
  }
}
