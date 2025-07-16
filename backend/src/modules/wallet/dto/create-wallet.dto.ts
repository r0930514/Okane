import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: '錢包名稱',
    example: '台新銀行帳戶',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '錢包主要幣別',
    example: 'TWD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: '錢包擴展資料（JSON 格式）',
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    [key: string]: any;
  };
}
