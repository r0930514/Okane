import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

export enum WalletType {
  Cash = 'cash',
  Bank = 'bank',
  Stock = 'stock',
  Crypto = 'crypto',
  ForeignStock = 'foreign_stock',
  Card = 'card',
  Receivable = 'receivable',
  Payable = 'payable',
}

@Entity()
export class Wallet {
  @ApiProperty({
    description: '錢包唯一識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '錢包名稱',
    example: '台新銀行帳戶',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '錢包顏色標識（十六進位色碼）',
    example: '#007bff',
    required: false,
  })
  @Column({ nullable: true })
  color: string;

  @ApiProperty({
    description: '錢包主要幣別',
    example: 'TWD',
  })
  @Column({ default: 'TWD' })
  currency: string;

  @ApiProperty({
    description: '錢包類型',
    enum: WalletType,
    example: WalletType.Bank,
  })
  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.Cash,
  })
  type: WalletType;

  @ApiProperty({
    description: '服務提供者名稱（如銀行名稱、券商名稱）',
    example: '台新銀行',
    required: false,
  })
  @Column({ nullable: true })
  provider: string;

  @ApiProperty({
    description: '錢包類型特定的配置資料',
    examples: {
      bank: {
        summary: '銀行帳戶配置',
        value: {
          accountNumber: '1234567890',
          branchCode: '822',
        },
      },
      receivable: {
        summary: '應收帳款配置',
        value: {
          defaultCreditTerms: 'Net 30',
          overdueThresholdDays: 30,
          badDebtThresholdDays: 90,
          autoReminder: true,
          reminderDays: [7, 14, 30],
        },
      },
    },
    required: false,
  })
  @Column('jsonb', { nullable: true })
  config: {
    accountNumber?: string;
    branchCode?: string;
    apiKey?: string;
    secretKey?: string;
    brokerCode?: string;
    exchangeCode?: string;
    defaultCreditTerms?: string;
    overdueThresholdDays?: number;
    badDebtThresholdDays?: number;
    autoReminder?: boolean;
    reminderDays?: number[];
    [key: string]: any;
  };

  @ApiProperty({
    description: '錢包所有者',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @ApiProperty({
    description: '錢包交易歷史記錄',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactionHistory: Transaction[];

  @ApiProperty({
    description: '記錄建立時間',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '記錄最後更新時間',
    example: '2024-01-15T12:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
