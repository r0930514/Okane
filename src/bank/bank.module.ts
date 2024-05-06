import { Module } from '@nestjs/common';
import { BankControllerController } from './bank-controller/bank-controller.controller';
import { BankServiceService } from './bank-service/bank-service.service';

@Module({
  controllers: [BankControllerController],
  providers: [BankServiceService]
})
export class BankModule {}
