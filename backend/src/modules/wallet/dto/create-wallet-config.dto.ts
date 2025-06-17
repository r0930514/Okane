import { IsNumber, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletConfigDto {
  @ApiProperty({
    description: '錢包模組 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({
    description: '模組設定資料（根據模組格式填入）',
    example: {
      accountNumber: '1234567890',
      password: 'my_secure_password',
      branchCode: '822',
    },
  })
  @IsObject()
  @IsNotEmpty()
  moduleConfigData: object;
}
