import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
  Buy = 'buy',
  Sell = 'sell',
  Dividend = 'dividend',
  Interest = 'interest',
  ReceivableCreate = 'receivable_create',
  ReceivableCollect = 'receivable_collect',
  ReceivableWriteOff = 'receivable_write_off',
  PayableCreate = 'payable_create',
  PayablePayment = 'payable_payment',
}

@Entity()
export class Transaction {
  @ApiProperty({
    description: '交易唯一識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '交易發生日期時間',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({
    description: '交易金額（以錢包主幣別計算）',
    example: 1500.5,
  })
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: '交易描述或備註',
    example: '午餐費用',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: '交易類型',
    enum: TransactionType,
    example: TransactionType.Expense,
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.Expense,
  })
  type: TransactionType;

  @ApiProperty({
    description: '交易分類標籤',
    example: '餐飲',
    required: false,
  })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({
    description: '相關資產標識（如股票代碼、加密貨幣符號）',
    example: 'AAPL',
    required: false,
  })
  @Column({ nullable: true })
  relatedAsset: string;

  @ApiProperty({
    description: '交易類型特定的額外資料',
    examples: {
      stock: {
        summary: '股票交易範例',
        value: {
          stockSymbol: 'AAPL',
          shares: 10,
          pricePerShare: 150.25,
          fees: 9.95,
          brokerOrderId: 'ORD-12345',
        },
      },
      transfer: {
        summary: '轉帳交易範例',
        value: {
          transferDirection: 'out',
          originalAmount: 1000,
          originalCurrency: 'USD',
          convertedAmount: 32000,
          convertedCurrency: 'TWD',
          exchangeRate: 32,
          transferFee: 15,
          transferMethod: 'wire_transfer',
        },
      },
      crypto: {
        summary: '加密貨幣交易範例',
        value: {
          cryptoPair: 'BTC/USDT',
          shares: 0.5,
          pricePerShare: 45000,
          fees: 22.5,
          exchangeCode: 'binance',
        },
      },
      receivable: {
        summary: '應收帳款範例',
        value: {
          customerName: '客戶公司 ABC',
          customerContact: 'contact@abc.com',
          invoiceNumber: 'INV-2024-001',
          dueDate: '2024-02-15',
          creditTerms: 'Net 30',
          status: 'pending',
          remainingAmount: 50000,
        },
      },
    },
    required: false,
  })
  @Column('jsonb', { nullable: true })
  metadata: {
    stockSymbol?: string;
    shares?: number;
    pricePerShare?: number;
    exchangeRate?: number;
    cryptoPair?: string;
    fees?: number;
    brokerOrderId?: string;
    transferDirection?: 'in' | 'out';
    originalAmount?: number;
    originalCurrency?: string;
    convertedAmount?: number;
    convertedCurrency?: string;
    transferFee?: number;
    transferMethod?: string;
    customerName?: string;
    customerContact?: string;
    invoiceNumber?: string;
    dueDate?: string;
    creditTerms?: string;
    status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'bad_debt';
    paymentMethod?: string;
    collectedAmount?: number;
    remainingAmount?: number;
    overdaysDays?: number;
    [key: string]: any;
  };

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

  @ApiProperty({
    description: '所屬錢包',
    type: () => Wallet,
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.transactionHistory)
  wallet: Wallet;

  @ApiProperty({
    description: '轉帳群組識別碼（用於關聯轉出和轉入交易）',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @Column({ nullable: true })
  transferGroupId: string;

  @ApiProperty({
    description: '對方錢包（轉帳時的目標或來源錢包）',
    type: () => Wallet,
    required: false,
  })
  @ManyToOne(() => Wallet, { nullable: true })
  relatedWallet: Wallet;

  @ApiProperty({
    description: '配對交易識別碼（轉帳時對應的另一筆交易）',
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  @Column({ nullable: true })
  pairedTransactionId: string;
}
