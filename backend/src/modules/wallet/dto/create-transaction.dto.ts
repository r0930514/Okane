import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    description: '交易擴展資料（JSON 格式）',
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    [key: string]: any;
  };
}
