import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: jest.Mocked<Repository<Transaction>>;
  let walletRepository: jest.Mocked<Repository<Wallet>>;

  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    primaryCurrency: 'TWD',
    preferences: {},
    wallets: [],
  };

  const mockWallet = {
    id: 'wallet-1',
    name: 'Test Wallet',
    currency: 'TWD',
    metadata: {},
    user: mockUser,
    transactionHistory: [],
  } as Wallet;

  const mockTransaction = {
    id: 'transaction-1',
    amount: 100,
    description: 'Test transaction',
    date: new Date(),
    wallet: mockWallet,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Transaction;

  beforeEach(async () => {
    const mockTransactionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockWalletRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    walletRepository = module.get(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      walletId: 'wallet-1',
      amount: 100,
      description: 'Test transaction',
      date: new Date(),
    };

    it('should create transaction successfully', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);
      transactionRepository.create.mockReturnValue(mockTransaction);
      transactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createTransactionDto, 'user-1');

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wallet-1', user: { id: 'user-1' } },
      });
      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        wallet: mockWallet,
      });
      expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when wallet not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTransactionDto, 'user-1'))
        .rejects.toThrow(NotFoundException);
      
      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wallet-1', user: { id: 'user-1' } },
      });
      expect(transactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('createTransfer', () => {
    const fromWalletId = 'wallet-1';
    const toWalletId = 'wallet-2';
    const amount = 100;
    const description = 'Transfer test';
    const userId = 'user-1';

    const mockToWallet = {
      ...mockWallet,
      id: 'wallet-2',
      name: 'To Wallet',
    } as Wallet;

    const mockOutTransaction = {
      ...mockTransaction,
      amount: -100,
      metadata: {
        type: 'transfer',
        transferDirection: 'out',
        transferGroupId: expect.any(String),
        relatedWalletId: toWalletId,
      },
    };

    const mockInTransaction = {
      ...mockTransaction,
      id: 'transaction-2',
      amount: 100,
      wallet: mockToWallet,
      metadata: {
        type: 'transfer',
        transferDirection: 'in',
        transferGroupId: expect.any(String),
        relatedWalletId: fromWalletId,
      },
    };

    it('should create transfer successfully', async () => {
      walletRepository.findOne
        .mockResolvedValueOnce(mockWallet)
        .mockResolvedValueOnce(mockToWallet);
      
      transactionRepository.create
        .mockReturnValueOnce(mockOutTransaction as any)
        .mockReturnValueOnce(mockInTransaction as any);
      
      transactionRepository.save
        .mockResolvedValueOnce(mockOutTransaction as any)
        .mockResolvedValueOnce(mockInTransaction as any)
        .mockResolvedValueOnce({
          ...mockOutTransaction,
          metadata: {
            ...mockOutTransaction.metadata,
            pairedTransactionId: 'transaction-2',
          },
        } as any)
        .mockResolvedValueOnce({
          ...mockInTransaction,
          metadata: {
            ...mockInTransaction.metadata,
            pairedTransactionId: 'transaction-1',
          },
        } as any);

      const result = await service.createTransfer(
        fromWalletId,
        toWalletId,
        amount,
        description,
        userId,
      );

      expect(walletRepository.findOne).toHaveBeenCalledTimes(2);
      expect(transactionRepository.create).toHaveBeenCalledTimes(2);
      expect(transactionRepository.save).toHaveBeenCalledTimes(4);
      expect(result.outTransaction).toBeDefined();
      expect(result.inTransaction).toBeDefined();
      expect(result.outTransaction.amount).toBe(-100);
      expect(result.inTransaction.amount).toBe(100);
    });

    it('should throw NotFoundException when from wallet not found', async () => {
      walletRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockToWallet);

      await expect(service.createTransfer(
        fromWalletId,
        toWalletId,
        amount,
        description,
        userId,
      )).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when to wallet not found', async () => {
      walletRepository.findOne
        .mockResolvedValueOnce(mockWallet)
        .mockResolvedValueOnce(null);

      await expect(service.createTransfer(
        fromWalletId,
        toWalletId,
        amount,
        description,
        userId,
      )).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when transferring to same wallet', async () => {
      walletRepository.findOne
        .mockResolvedValueOnce(mockWallet)
        .mockResolvedValueOnce(mockWallet); // Same wallet returned for both calls

      await expect(service.createTransfer(
        fromWalletId,
        fromWalletId, // Same wallet ID
        amount,
        description,
        userId,
      )).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for user', async () => {
      const mockTransactions = [mockTransaction];
      transactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll('user-1');

      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { wallet: { user: { id: 'user-1' } } },
        relations: ['wallet'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should return transactions filtered by wallet', async () => {
      const mockTransactions = [mockTransaction];
      transactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll('user-1', 'wallet-1');

      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { wallet: { user: { id: 'user-1' }, id: 'wallet-1' } },
        relations: ['wallet'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('findOne', () => {
    it('should return transaction when found', async () => {
      transactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne('transaction-1', 'user-1');

      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'transaction-1', wallet: { user: { id: 'user-1' } } },
        relations: ['wallet'],
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      transactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('transaction-1', 'user-1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateTransactionDto: UpdateTransactionDto = {
      description: 'Updated description',
      amount: 200,
    };

    it('should update transaction successfully', async () => {
      const updatedTransaction = { ...mockTransaction, ...updateTransactionDto };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTransaction);
      transactionRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.update('transaction-1', updateTransactionDto, 'user-1');

      expect(service.findOne).toHaveBeenCalledWith('transaction-1', 'user-1');
      expect(transactionRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw BadRequestException when trying to update transfer amount', async () => {
      const transferTransaction = {
        ...mockTransaction,
        metadata: { type: 'transfer' },
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(transferTransaction);

      await expect(service.update('transaction-1', updateTransactionDto, 'user-1'))
        .rejects.toThrow(BadRequestException);
    });

    it('should allow updating transfer description', async () => {
      const transferTransaction = {
        ...mockTransaction,
        metadata: { type: 'transfer' },
      };
      const updateDto = { description: 'Updated description' };
      const updatedTransaction = { ...transferTransaction, ...updateDto };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(transferTransaction);
      transactionRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.update('transaction-1', updateDto, 'user-1');

      expect(result).toEqual(updatedTransaction);
    });
  });

  describe('remove', () => {
    it('should remove regular transaction', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTransaction);
      transactionRepository.remove.mockResolvedValue(undefined);

      await service.remove('transaction-1', 'user-1');

      expect(service.findOne).toHaveBeenCalledWith('transaction-1', 'user-1');
      expect(transactionRepository.remove).toHaveBeenCalledWith(mockTransaction);
    });

    it('should remove transfer transaction and its pair', async () => {
      const transferTransaction = {
        ...mockTransaction,
        metadata: {
          type: 'transfer',
          pairedTransactionId: 'transaction-2',
        },
      };
      const pairedTransaction = {
        ...mockTransaction,
        id: 'transaction-2',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(transferTransaction);
      transactionRepository.findOne.mockResolvedValue(pairedTransaction);
      transactionRepository.remove.mockResolvedValue(undefined);

      await service.remove('transaction-1', 'user-1');

      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'transaction-2' },
      });
      expect(transactionRepository.remove).toHaveBeenCalledWith([
        transferTransaction,
        pairedTransaction,
      ]);
    });

    it('should remove transfer transaction even if pair not found', async () => {
      const transferTransaction = {
        ...mockTransaction,
        metadata: {
          type: 'transfer',
          pairedTransactionId: 'transaction-2',
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(transferTransaction);
      transactionRepository.findOne.mockResolvedValue(null);
      transactionRepository.remove.mockResolvedValue(undefined);

      await service.remove('transaction-1', 'user-1');

      expect(transactionRepository.remove).toHaveBeenCalledWith(transferTransaction);
    });
  });

  describe('getTransactionsByCategory', () => {
    it('should return transactions by category', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTransaction]),
      };

      transactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getTransactionsByCategory('user-1', 'food');

      expect(transactionRepository.createQueryBuilder).toHaveBeenCalledWith('transaction');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('transaction.wallet', 'wallet');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('wallet.user', 'user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', { userId: 'user-1' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "transaction.metadata->>'category' = :category",
        { category: 'food' }
      );
      expect(result).toEqual([mockTransaction]);
    });
  });

  describe('getTransactionsByDateRange', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');

    it('should return transactions by date range without wallet filter', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTransaction]),
      };

      transactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getTransactionsByDateRange('user-1', startDate, endDate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.date BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
      expect(result).toEqual([mockTransaction]);
    });

    it('should return transactions by date range with wallet filter', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTransaction]),
      };

      transactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getTransactionsByDateRange(
        'user-1',
        startDate,
        endDate,
        'wallet-1'
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.date BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'wallet.id = :walletId',
        { walletId: 'wallet-1' }
      );
      expect(result).toEqual([mockTransaction]);
    });
  });
});