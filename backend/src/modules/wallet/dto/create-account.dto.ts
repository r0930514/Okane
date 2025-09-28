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
  BankAccountData,
  CashAccountData,
  CryptoAccountData,
} from '../../../entities/account.entity';

// 銀行帳戶特定資料 DTO
export class CreateBankAccountDataDto implements BankAccountData {
  @ApiProperty({
    description: '銀行名稱',
    example: '台新銀行',
  })
  @IsString()
  bankName: string;

  @ApiProperty({
    description: '帳戶號碼',
    example: '1234567890',
  })
  @IsString()
  accountNumber: string;

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

// 現金帳戶特定資料 DTO
export class CreateCashAccountDataDto implements CashAccountData {
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

// 加密貨幣帳戶特定資料 DTO
export class CreateCryptoAccountDataDto implements CryptoAccountData {
  @ApiProperty({
    description: '錢包地址',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: '網路/區塊鏈',
    example: 'Bitcoin',
  })
  @IsString()
  network: string;

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

// 主要建立帳戶 DTO
export class CreateAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '台新銀行活存帳戶',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額',
    example: 10000.0,
  })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    description: '可用餘額',
    example: 10000.0,
  })
  @IsNumber()
  @Min(0)
  availableBalance: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: '帳戶分類',
    enum: AccountClassification,
    example: AccountClassification.ASSET,
  })
  @IsEnum(AccountClassification)
  classification: AccountClassification;

  @ApiProperty({
    description: '帳戶類型',
    enum: AccountType,
    example: AccountType.BANK,
  })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({
    description: '帳戶特定資料（根據類型而定）',
    oneOf: [
      { $ref: '#/components/schemas/CreateBankAccountDataDto' },
      { $ref: '#/components/schemas/CreateCashAccountDataDto' },
      { $ref: '#/components/schemas/CreateCryptoAccountDataDto' },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type((opts) => {
    if (opts?.object && 'type' in opts.object) {
      switch ((opts.object as any).type) {
        case AccountType.BANK:
          return CreateBankAccountDataDto;
        case AccountType.CASH:
          return CreateCashAccountDataDto;
        case AccountType.CRYPTO:
          return CreateCryptoAccountDataDto;
        default:
          return Object;
      }
    }
    return Object;
  })
  accountableData?:
    | CreateBankAccountDataDto
    | CreateCashAccountDataDto
    | CreateCryptoAccountDataDto;
}

// 銀行帳戶專用建立 DTO
export class CreateBankAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '台新銀行活存帳戶',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額',
    example: 10000.0,
  })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: '銀行帳戶資料',
  })
  @ValidateNested()
  @Type(() => CreateBankAccountDataDto)
  bankData: CreateBankAccountDataDto;
}

// 現金帳戶專用建立 DTO
export class CreateCashAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '零用錢',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額',
    example: 1000.0,
  })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: '現金帳戶資料',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCashAccountDataDto)
  cashData?: CreateCashAccountDataDto;
}

// 加密貨幣帳戶專用建立 DTO
export class CreateCryptoAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: 'Bitcoin 錢包',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額',
    example: 0.5,
  })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'BTC',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: '加密貨幣帳戶資料',
  })
  @ValidateNested()
  @Type(() => CreateCryptoAccountDataDto)
  cryptoData: CreateCryptoAccountDataDto;
}
