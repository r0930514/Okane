import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, TransactionSource } from '../../../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: '交易金額',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: '交易描述',
    example: '午餐費用',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: '交易類型',
    enum: TransactionType,
    example: TransactionType.Expense,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description: '交易分類',
    example: '餐飲',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: '交易日期（ISO 8601 格式）',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: '外部交易 ID',
    example: 'TXN-12345',
  })
  @IsOptional()
  @IsNumber()
  transactionId?: number;

  @ApiPropertyOptional({
    description: '交易來源',
    enum: TransactionSource,
    example: TransactionSource.Manual,
  })
  @IsOptional()
  @IsEnum(TransactionSource)
  source?: TransactionSource;

  @ApiPropertyOptional({
    description: '外部系統交易ID（用於同步對帳）',
    example: 'EXT-12345',
  })
  @IsOptional()
  @IsString()
  externalTransactionId?: string;
}
