import { Test, TestingModule } from '@nestjs/testing';
import { BankServiceService } from './bank-service.service';

describe('BankServiceService', () => {
  let service: BankServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankServiceService],
    }).compile();

    service = module.get<BankServiceService>(BankServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
