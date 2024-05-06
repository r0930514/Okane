import { Test, TestingModule } from '@nestjs/testing';
import { BankControllerController } from './bank-controller.controller';

describe('BankControllerController', () => {
  let controller: BankControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankControllerController],
    }).compile();

    controller = module.get<BankControllerController>(BankControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
