import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  AccountType,
  AccountClassification,
  AccountStatus,
  BankAccountData,
  CashAccountData,
  CryptoAccountData,
} from '../../../entities/account.entity';

// 銀行帳戶資料更新 DTO
export class UpdateBankAccountDataDto implements Partial<BankAccountData> {
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

  @ApiProperty({
    description: '分行代碼',
    example: 'TSB001',
    required: false,
  })
  @IsOptional()
  @IsString()
  branchCode?: string;

  @ApiProperty({
    description: 'SWIFT代碼',
    example: 'TSIBTWTP',
    required: false,
  })
  @IsOptional()
  @IsString()
  swiftCode?: string;

  @ApiProperty({
    description: '銀行地址',
    example: '台北市信義區信義路五段7號',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankAddress?: string;
}

// 現金帳戶資料更新 DTO
export class UpdateCashAccountDataDto implements Partial<CashAccountData> {
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

// 加密貨幣帳戶資料更新 DTO
export class UpdateCryptoAccountDataDto implements Partial<CryptoAccountData> {
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

// 主要更新帳戶 DTO
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

  @ApiProperty({
    description: '帳戶特定資料（根據類型而定）',
    oneOf: [
      { $ref: '#/components/schemas/UpdateBankAccountDataDto' },
      { $ref: '#/components/schemas/UpdateCashAccountDataDto' },
      { $ref: '#/components/schemas/UpdateCryptoAccountDataDto' },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type((opts) => {
    if (opts?.object && 'type' in opts.object) {
      switch ((opts.object as any).type) {
        case AccountType.BANK:
          return UpdateBankAccountDataDto;
        case AccountType.CASH:
          return UpdateCashAccountDataDto;
        case AccountType.CRYPTO:
          return UpdateCryptoAccountDataDto;
        default:
          return Object;
      }
    }
    return Object;
  })
  accountableData?:
    | UpdateBankAccountDataDto
    | UpdateCashAccountDataDto
    | UpdateCryptoAccountDataDto;
}

// 特定類型的更新 DTO
export class UpdateBankAccountDto {
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
    description: '帳戶狀態',
    enum: AccountStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({
    description: '銀行帳戶資料',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBankAccountDataDto)
  bankData?: UpdateBankAccountDataDto;
}

export class UpdateCashAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '零用錢',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '餘額',
    example: 2000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({
    description: '可用餘額',
    example: 2000.0,
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
    description: '帳戶狀態',
    enum: AccountStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({
    description: '現金帳戶資料',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCashAccountDataDto)
  cashData?: UpdateCashAccountDataDto;
}

export class UpdateCryptoAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: 'Bitcoin 錢包',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '餘額',
    example: 0.75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({
    description: '可用餘額',
    example: 0.75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableBalance?: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'BTC',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: '帳戶狀態',
    enum: AccountStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({
    description: '加密貨幣帳戶資料',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCryptoAccountDataDto)
  cryptoData?: UpdateCryptoAccountDataDto;
}
