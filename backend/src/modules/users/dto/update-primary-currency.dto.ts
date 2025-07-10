import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrimaryCurrencyDto {
  @ApiProperty({
    description: '主貨幣代碼',
    example: 'TWD',
    enum: ['TWD', 'USD', 'EUR', 'JPY', 'USDT', 'BTC', 'ETH'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['TWD', 'USD', 'EUR', 'JPY', 'USDT', 'BTC', 'ETH'])
  primaryCurrency: string;
}
