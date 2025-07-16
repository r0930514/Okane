import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({
    description: '轉出錢包識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  fromWalletId: string;

  @ApiProperty({
    description: '轉入錢包識別碼',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  toWalletId: string;

  @ApiProperty({
    description: '轉帳金額',
    example: 1000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: '轉帳描述',
    example: '錢包間轉帳',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: '轉帳擴展資料（JSON 格式）',
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    [key: string]: any;
  };
}
