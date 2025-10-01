import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 銀行帳戶專用建立 DTO
export class CreateBankAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '台新銀行活存帳戶',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額（選填，若填寫則會建立期初餘額交易記錄）',
    example: 10000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
  })
  @IsString()
  currency: string;

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
    description: '初始餘額（選填，若填寫則會建立期初餘額交易記錄）',
    example: 1000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'TWD',
  })
  @IsString()
  currency: string;

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

// 加密貨幣帳戶專用建立 DTO
export class CreateCryptoAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: 'Bitcoin 錢包',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '初始餘額（選填，若填寫則會建立期初餘額交易記錄）',
    example: 0.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @ApiProperty({
    description: '幣別代碼',
    example: 'BTC',
  })
  @IsString()
  currency: string;

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
