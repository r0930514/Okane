import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '../../../entities/wallet.entity';

export class WalletWithBalanceDto extends Wallet {
  @ApiProperty({
    description: '錢包當前餘額',
    example: 50000.5,
    type: 'number',
  })
  balance: number;
}
