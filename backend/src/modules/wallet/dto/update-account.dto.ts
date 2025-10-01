import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  AccountClassification,
  AccountStatus,
} from '../../../entities/account.entity';

// 通用更新帳戶 DTO
export class UpdateAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '台新銀行活存帳戶',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '餘額',
    example: 15000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({
    description: '可用餘額',
    example: 14500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableBalance?: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: '帳戶分類',
    enum: AccountClassification,
    example: AccountClassification.ASSET,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountClassification)
  classification?: AccountClassification;

  @ApiProperty({
    description: '帳戶狀態',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}

// 銀行帳戶專用更新 DTO
export class UpdateBankAccountDto extends UpdateAccountDto {
  @ApiProperty({
    description: '銀行名稱',
    example: '台新銀行',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: '帳戶號碼',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountNumber?: string;
}

// 現金帳戶專用更新 DTO
export class UpdateCashAccountDto extends UpdateAccountDto {
  @ApiProperty({
    description: '存放位置',
    example: '錢包',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: '備註',
    example: '日常零用錢',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

// 加密貨幣帳戶專用更新 DTO
export class UpdateCryptoAccountDto extends UpdateAccountDto {
  @ApiProperty({
    description: '錢包地址',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiProperty({
    description: '網路/區塊鏈',
    example: 'Bitcoin',
    required: false,
  })
  @IsOptional()
  @IsString()
  network?: string;

  @ApiProperty({
    description: '協議類型',
    example: 'ERC-20',
    required: false,
  })
  @IsOptional()
  @IsString()
  protocol?: string;

  @ApiProperty({
    description: '公鑰',
    example: '04a34b...',
    required: false,
  })
  @IsOptional()
  @IsString()
  publicKey?: string;

  @ApiProperty({
    description: '錢包類型',
    example: 'hardware',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletType?: string;
}
