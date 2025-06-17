import {
  IsString,
  IsObject,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWalletModuleDto {
  @ApiProperty({
    description: '錢包模組名稱',
    example: '台新銀行',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  moduleName: string;

  @ApiProperty({
    description: '模組設定檔格式（JSON 物件）',
    example: {
      accountNumber: 'string',
      password: 'string',
      branchCode: 'string',
    },
  })
  @IsObject()
  @IsNotEmpty()
  moduleConfigFormat: object;

  @ApiPropertyOptional({
    description: '模組呼叫的外部服務 URL',
    example: 'https://api.taishin.com.tw',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  moduleCallURL?: string;
}
