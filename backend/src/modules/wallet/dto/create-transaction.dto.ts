import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: '錢包識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: '交易發生日期時間',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({
    description: '交易金額',
    example: 1500.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: '交易描述或備註',
    example: '午餐費用',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: '交易類型',
    enum: TransactionType,
    example: TransactionType.Expense,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: '交易分類標籤',
    example: '餐飲',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: '相關資產標識',
    example: 'AAPL',
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedAsset?: string;

  @ApiProperty({
    description: '交易類型特定的額外資料',
    example: {
      stockSymbol: 'AAPL',
      shares: 10,
      pricePerShare: 150.25,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
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
    description: '相關錢包識別碼（轉帳時使用）',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  relatedWalletId?: string;
}
