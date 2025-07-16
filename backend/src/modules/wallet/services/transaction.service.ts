import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const wallet = await this.walletRepository.findOne({
      where: { id: createTransactionDto.walletId, user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      wallet,
    });

    return this.transactionRepository.save(transaction);
  }

  async createTransfer(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    description: string,
    userId: string,
    metadata?: any,
  ): Promise<{ outTransaction: Transaction; inTransaction: Transaction }> {
    const fromWallet = await this.walletRepository.findOne({
      where: { id: fromWalletId, user: { id: userId } },
    });

    const toWallet = await this.walletRepository.findOne({
      where: { id: toWalletId, user: { id: userId } },
    });

    if (!fromWallet || !toWallet) {
      throw new NotFoundException('One or both wallets not found');
    }

    if (fromWalletId === toWalletId) {
      throw new BadRequestException('Cannot transfer to the same wallet');
    }

    const transferGroupId = uuidv4();

    const outTransaction = this.transactionRepository.create({
      amount: -Math.abs(amount),
      description,
      wallet: fromWallet,
      metadata: {
        ...metadata,
        type: 'transfer',
        transferDirection: 'out',
        transferGroupId,
        relatedWalletId: toWalletId,
      },
    });

    const inTransaction = this.transactionRepository.create({
      amount: Math.abs(amount),
      description,
      wallet: toWallet,
      metadata: {
        ...metadata,
        type: 'transfer',
        transferDirection: 'in',
        transferGroupId,
        relatedWalletId: fromWalletId,
      },
    });

    const savedOutTransaction =
      await this.transactionRepository.save(outTransaction);
    const savedInTransaction =
      await this.transactionRepository.save(inTransaction);

    // 更新 metadata 以包含配對的交易 ID
    savedOutTransaction.metadata = {
      ...savedOutTransaction.metadata,
      pairedTransactionId: savedInTransaction.id,
    };
    savedInTransaction.metadata = {
      ...savedInTransaction.metadata,
      pairedTransactionId: savedOutTransaction.id,
    };

    await this.transactionRepository.save(savedOutTransaction);
    await this.transactionRepository.save(savedInTransaction);

    return {
      outTransaction: savedOutTransaction,
      inTransaction: savedInTransaction,
    };
  }

  async findAll(userId: string, walletId?: string): Promise<Transaction[]> {
    const whereClause: any = {
      wallet: { user: { id: userId } },
    };

    if (walletId) {
      whereClause.wallet.id = walletId;
    }

    return this.transactionRepository.find({
      where: whereClause,
      relations: ['wallet'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, wallet: { user: { id: userId } } },
      relations: ['wallet'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    if (
      transaction.metadata?.type === 'transfer' &&
      updateTransactionDto.amount
    ) {
      throw new BadRequestException(
        'Cannot update transfer transaction amount directly',
      );
    }

    Object.assign(transaction, updateTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);

    if (
      transaction.metadata?.type === 'transfer' &&
      transaction.metadata?.pairedTransactionId
    ) {
      const pairedTransaction = await this.transactionRepository.findOne({
        where: { id: transaction.metadata.pairedTransactionId },
      });

      if (pairedTransaction) {
        await this.transactionRepository.remove([
          transaction,
          pairedTransaction,
        ]);
      } else {
        await this.transactionRepository.remove(transaction);
      }
    } else {
      await this.transactionRepository.remove(transaction);
    }
  }

  async getTransactionsByCategory(
    userId: string,
    category: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere("transaction.metadata->>'category' = :category", { category })
      .orderBy('transaction.date', 'DESC')
      .getMany();
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    walletId?: string,
  ): Promise<Transaction[]> {
    let query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('transaction.date', 'DESC');

    if (walletId) {
      query = query.andWhere('wallet.id = :walletId', { walletId });
    }

    return query.getMany();
  }
}
