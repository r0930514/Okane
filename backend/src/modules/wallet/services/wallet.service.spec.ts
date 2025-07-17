import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from '../../../entities/wallet.entity';
import { User } from '../../../entities/user.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: jest.Mocked<Repository<Wallet>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    primaryCurrency: 'TWD',
    preferences: {},
    wallets: [],
  } as User;

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
  };

  beforeEach(async () => {
    const mockWalletRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get(getRepositoryToken(Wallet));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createWalletDto: CreateWalletDto = {
      name: 'New Wallet',
      currency: 'TWD',
      metadata: {},
    };

    it('should create a wallet successfully', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      walletRepository.create.mockReturnValue(mockWallet);
      walletRepository.save.mockResolvedValue(mockWallet);

      const result = await service.create(createWalletDto, 'user-1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(walletRepository.create).toHaveBeenCalledWith({
        ...createWalletDto,
        user: mockUser,
      });
      expect(walletRepository.save).toHaveBeenCalledWith(mockWallet);
      expect(result).toEqual(mockWallet);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createWalletDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(walletRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return wallets with calculated balance', async () => {
      const walletWithTransactions = {
        ...mockWallet,
        transactionHistory: [
          { ...mockTransaction, amount: 100 },
          { ...mockTransaction, amount: -30 },
          { ...mockTransaction, amount: 50 },
        ],
      };

      walletRepository.find.mockResolvedValue([walletWithTransactions]);

      const result = await service.findAll('user-1');

      expect(walletRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
        relations: ['transactionHistory'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].balance).toBe(120); // 100 - 30 + 50
    });

    it('should return empty array when no wallets found', async () => {
      walletRepository.find.mockResolvedValue([]);

      const result = await service.findAll('user-1');

      expect(result).toEqual([]);
    });

    it('should handle wallets with no transactions', async () => {
      walletRepository.find.mockResolvedValue([mockWallet]);

      const result = await service.findAll('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].balance).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return wallet with balance when found', async () => {
      const walletWithTransactions = {
        ...mockWallet,
        transactionHistory: [
          { ...mockTransaction, amount: 100 },
          { ...mockTransaction, amount: 200 },
        ],
      };

      walletRepository.findOne.mockResolvedValue(walletWithTransactions);

      const result = await service.findOne('wallet-1', 'user-1');

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wallet-1', user: { id: 'user-1' } },
        relations: ['transactionHistory', 'user'],
      });
      expect(result.balance).toBe(300);
    });

    it('should throw NotFoundException when wallet not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('wallet-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateWalletDto: UpdateWalletDto = {
      name: 'Updated Wallet',
      metadata: { color: '#00FF00' },
    };

    it('should update wallet successfully', async () => {
      const walletWithBalance = {
        ...mockWallet,
        balance: 100,
      };

      // Mock findOne method of the service
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(walletWithBalance as any);
      walletRepository.save.mockResolvedValue({
        ...mockWallet,
        ...updateWalletDto,
      });

      const result = await service.update(
        'wallet-1',
        updateWalletDto,
        'user-1',
      );

      expect(service.findOne).toHaveBeenCalledWith('wallet-1', 'user-1');
      expect(walletRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...mockWallet, ...updateWalletDto });
    });

    it('should throw NotFoundException when wallet not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.update('wallet-1', updateWalletDto, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove wallet when no transactions exist', async () => {
      const walletWithBalance = {
        ...mockWallet,
        balance: 0,
        transactionHistory: [],
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(walletWithBalance as any);
      walletRepository.remove.mockResolvedValue(undefined);

      await service.remove('wallet-1', 'user-1');

      expect(service.findOne).toHaveBeenCalledWith('wallet-1', 'user-1');
      expect(walletRepository.remove).toHaveBeenCalledWith(walletWithBalance);
    });

    it('should throw BadRequestException when wallet has transactions', async () => {
      const walletWithTransactions = {
        ...mockWallet,
        balance: 100,
        transactionHistory: [mockTransaction],
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(walletWithTransactions as any);

      await expect(service.remove('wallet-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle null transactionHistory gracefully', async () => {
      const walletWithNullTransactions = {
        ...mockWallet,
        balance: 0,
        transactionHistory: null,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(walletWithNullTransactions as any);
      walletRepository.remove.mockResolvedValue(undefined);

      await service.remove('wallet-1', 'user-1');

      expect(walletRepository.remove).toHaveBeenCalledWith(
        walletWithNullTransactions,
      );
    });
  });

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      const walletWithTransactions = {
        ...mockWallet,
        transactionHistory: [
          { ...mockTransaction, amount: 100 },
          { ...mockTransaction, amount: -25 },
          { ...mockTransaction, amount: 75 },
        ],
      };

      walletRepository.findOne.mockResolvedValue(walletWithTransactions);

      const result = await service.getBalance('wallet-1', 'user-1');

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wallet-1', user: { id: 'user-1' } },
        relations: ['transactionHistory'],
      });
      expect(result).toBe(150); // 100 - 25 + 75
    });

    it('should throw NotFoundException when wallet not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.getBalance('wallet-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return 0 for wallet with no transactions', async () => {
      const walletWithoutTransactions = {
        ...mockWallet,
        transactionHistory: [],
      };

      walletRepository.findOne.mockResolvedValue(walletWithoutTransactions);

      const result = await service.getBalance('wallet-1', 'user-1');

      expect(result).toBe(0);
    });
  });

  describe('calculateBalance (private method)', () => {
    it('should calculate balance correctly with mixed transactions', () => {
      const wallet = {
        ...mockWallet,
        transactionHistory: [
          { amount: 100 },
          { amount: -50 },
          { amount: 25 },
          { amount: -10 },
        ],
      } as any;

      // Access private method for testing
      const balance = (service as any).calculateBalance(wallet);

      expect(balance).toBe(65); // 100 - 50 + 25 - 10
    });

    it('should return 0 for wallet with empty transaction history', () => {
      const wallet = {
        ...mockWallet,
        transactionHistory: [],
      } as any;

      const balance = (service as any).calculateBalance(wallet);

      expect(balance).toBe(0);
    });

    it('should return 0 for wallet with null transaction history', () => {
      const wallet = {
        ...mockWallet,
        transactionHistory: null,
      } as any;

      const balance = (service as any).calculateBalance(wallet);

      expect(balance).toBe(0);
    });

    it('should handle string amounts correctly', () => {
      const wallet = {
        ...mockWallet,
        transactionHistory: [
          { amount: '100.50' },
          { amount: '-25.25' },
          { amount: '10' },
        ],
      } as any;

      const balance = (service as any).calculateBalance(wallet);

      expect(balance).toBe(85.25); // 100.50 - 25.25 + 10
    });
  });
});
