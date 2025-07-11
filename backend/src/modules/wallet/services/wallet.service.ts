import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';
import { User } from '../../../entities/user.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createWalletDto: CreateWalletDto,
    userId: string,
  ): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wallet = this.walletRepository.create({
      ...createWalletDto,
      user,
    });

    return this.walletRepository.save(wallet);
  }

  async findAll(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { user: { id: userId } },
      relations: ['transactionHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['transactionHistory', 'user'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async update(
    id: string,
    updateWalletDto: UpdateWalletDto,
    userId: string,
  ): Promise<Wallet> {
    const wallet = await this.findOne(id, userId);

    Object.assign(wallet, updateWalletDto);
    return this.walletRepository.save(wallet);
  }

  async remove(id: string, userId: string): Promise<void> {
    const wallet = await this.findOne(id, userId);

    // Check if wallet has transactions
    if (wallet.transactionHistory && wallet.transactionHistory.length > 0) {
      throw new BadRequestException(
        'Cannot delete wallet with existing transactions',
      );
    }

    await this.walletRepository.remove(wallet);
  }

  async getBalance(id: string, userId: string): Promise<number> {
    const wallet = await this.findOne(id, userId);

    if (!wallet.transactionHistory || wallet.transactionHistory.length === 0) {
      return 0;
    }

    return wallet.transactionHistory.reduce((balance, transaction) => {
      switch (transaction.type) {
        case 'income':
        case 'buy':
        case 'dividend':
        case 'interest':
        case 'receivable_create':
        case 'receivable_collect':
          return balance + Number(transaction.amount);
        case 'expense':
        case 'sell':
        case 'receivable_write_off':
        case 'payable_create':
        case 'payable_payment':
          return balance - Number(transaction.amount);
        case 'transfer':
          if (transaction.metadata?.transferDirection === 'in') {
            return balance + Number(transaction.amount);
          } else {
            return balance - Number(transaction.amount);
          }
        default:
          return balance;
      }
    }, 0);
  }
}
