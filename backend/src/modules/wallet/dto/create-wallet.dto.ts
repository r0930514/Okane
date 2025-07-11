import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '../../../entities/wallet.entity';

export class CreateWalletDto {
  @ApiProperty({
    description: '錢包名稱',
    example: '台新銀行帳戶',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '錢包顏色標識（十六進位色碼）',
    example: '#007bff',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: '錢包主要幣別',
    example: 'TWD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: '錢包類型',
    enum: WalletType,
    example: WalletType.Bank,
  })
  @IsEnum(WalletType)
  type: WalletType;

  @ApiProperty({
    description: '服務提供者名稱（如銀行名稱、券商名稱）',
    example: '台新銀行',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: '錢包類型特定的配置資料',
    example: {
      accountNumber: '1234567890',
      branchCode: '822',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  config?: {
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
}
