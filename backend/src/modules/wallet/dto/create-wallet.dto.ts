import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WalletType, WalletOperationMode } from '../../../entities/wallet.entity';

export class CreateWalletDto {
  @ApiProperty({
    description: '錢包名稱',
    example: '現金錢包',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  walletName: string;

  @ApiPropertyOptional({
    description: '帳戶號碼或識別碼',
    example: 'CASH-001',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountNumber?: string;

  @ApiPropertyOptional({
    description: '錢包類型',
    enum: WalletType,
    example: WalletType.Manual,
  })
  @IsOptional()
  @IsEnum(WalletType)
  walletType?: WalletType;

  @ApiPropertyOptional({
    description: '錢包顏色（十六進位色碼）',
    example: '#007bff',
    maxLength: 7,
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  walletColor?: string;

  @ApiPropertyOptional({
    description: '初始餘額',
    example: 1000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  initialBalance?: number;

  @ApiPropertyOptional({
    description: '錢包配置ID（用於關聯錢包模組）',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  walletConfigId?: number;

  @ApiPropertyOptional({
    description: '錢包操作模式',
    enum: WalletOperationMode,
    example: WalletOperationMode.Hybrid,
  })
  @IsOptional()
  @IsEnum(WalletOperationMode)
  operationMode?: WalletOperationMode;
}
