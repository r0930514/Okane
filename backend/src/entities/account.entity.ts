import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

export enum AccountClassification {
  ASSET = 'asset', // 資產
  LIABILITY = 'liability', // 負債
}

export enum AccountStatus {
  ACTIVE = 'active', // 啟用
  DRAFT = 'draft', // 草稿
  DISABLED = 'disabled', // 禁用
  PENDING_DELETION = 'pending_deletion', // 等待刪除
}

export enum AccountType {
  BANK = 'bank', // 銀行帳戶
  CASH = 'cash', // 手頭現金
  CRYPTO = 'crypto', // 加密貨幣帳戶
}

export enum BalanceType {
  CASH = 'cash', // 現金
  NON_CASH = 'non_cash', // 非現金
  INVESTMENT = 'investment', // 投資
}

// 基礎帳戶實體 - 使用類別表繼承
@Entity('account')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the account' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the account' })
  name: string;

  @Column({
    default: '#374151',
  })
  @ApiProperty({
    description: 'Color of the account',
    example: '#FF5733',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid hex code' })
  color: string;

  @Column({
    nullable: true,
  })
  @ApiProperty({ description: 'Icon of the account', required: false })
  icon: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  @ApiProperty({ description: 'Balance of the account' })
  balance: number;

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

  @ApiProperty({
    description: '帳戶所有者',
    type: () => 'User',
  })
  @ManyToOne('User', 'accounts')
  user: User;

  @ApiProperty({
    description: '帳戶的交易記錄',
    type: () => ['Transaction'],
  })
  @OneToMany('Transaction', 'account')
  transactions: Transaction[];

  // 抽象方法：由子類實作以返回帳戶類型
  abstract get accountType(): AccountType;

  // 抽象方法：由子類實作以返回餘額類型
  abstract get balanceType(): BalanceType;

  // 便利方法：取得特定類型的顯示名稱
  get typeDisplayName(): string {
    switch (this.accountType) {
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

// 銀行帳戶實體
@ChildEntity(AccountType.BANK)
export class BankAccount extends Account {
  @Column()
  @ApiProperty({ description: '銀行名稱', example: '台新銀行' })
  bankName: string;

  @Column()
  @ApiProperty({ description: '帳戶號碼', example: '1234567890' })
  accountNumber: string;

  get accountType(): AccountType {
    return AccountType.BANK;
  }

  get balanceType(): BalanceType {
    return BalanceType.CASH;
  }
}

// 現金帳戶實體
@ChildEntity(AccountType.CASH)
export class CashAccount extends Account {
  @Column({ nullable: true })
  @ApiProperty({ description: '存放位置', example: '錢包', required: false })
  location?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '備註', example: '日常零用錢', required: false })
  notes?: string;

  get accountType(): AccountType {
    return AccountType.CASH;
  }

  get balanceType(): BalanceType {
    return BalanceType.CASH;
  }
}

// 加密貨幣帳戶實體
@ChildEntity(AccountType.CRYPTO)
export class CryptoAccount extends Account {
  @Column()
  @ApiProperty({
    description: '錢包地址',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  })
  walletAddress: string;

  @Column()
  @ApiProperty({ description: '網路/區塊鏈', example: 'Bitcoin' })
  network: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '協議類型', example: 'ERC-20', required: false })
  protocol?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '公鑰', example: '04a34b...', required: false })
  publicKey?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '錢包類型',
    example: 'hardware',
    required: false,
  })
  walletType?: string;

  get accountType(): AccountType {
    return AccountType.CRYPTO;
  }

  get balanceType(): BalanceType {
    return BalanceType.INVESTMENT;
  }
}
