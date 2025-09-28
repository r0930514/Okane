import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { Account } from '../../../entities/account.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.accountId, user: { id: userId } },
    });

    if (!account) {
      throw new NotFoundException('帳戶不存在');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      account,
    });

    return this.transactionRepository.save(transaction);
  }

  async createTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string,
    userId: string,
    metadata?: any,
  ): Promise<{ outTransaction: Transaction; inTransaction: Transaction }> {
    const fromAccount = await this.accountRepository.findOne({
      where: { id: fromAccountId, user: { id: userId } },
    });

    const toAccount = await this.accountRepository.findOne({
      where: { id: toAccountId, user: { id: userId } },
    });

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('轉出或轉入帳戶不存在');
    }

    if (fromAccountId === toAccountId) {
      throw new BadRequestException('不能向同一個帳戶轉帳');
    }

    const transferGroupId = uuidv4();

    const outTransaction = this.transactionRepository.create({
      amount: -Math.abs(amount),
      description,
      account: fromAccount,
      metadata: {
        ...metadata,
        type: 'transfer',
        transferDirection: 'out',
        transferGroupId,
        relatedAccountId: toAccountId,
      },
    });

    const inTransaction = this.transactionRepository.create({
      amount: Math.abs(amount),
      description,
      account: toAccount,
      metadata: {
        ...metadata,
        type: 'transfer',
        transferDirection: 'in',
        transferGroupId,
        relatedAccountId: fromAccountId,
      },
    });

    const savedOutTransaction =
      await this.transactionRepository.save(outTransaction);
    const savedInTransaction =
      await this.transactionRepository.save(inTransaction);

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

  async findAll(userId: string, accountId?: string): Promise<Transaction[]> {
    const whereClause: any = {
      account: { user: { id: userId } },
    };

    if (accountId) {
      whereClause.account.id = accountId;
    }

    return this.transactionRepository.find({
      where: whereClause,
      relations: ['account'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, account: { user: { id: userId } } },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException('交易不存在');
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
      throw new BadRequestException('無法直接修改轉帳交易的金額');
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
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('account.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere("transaction.metadata->>'category' = :category", { category })
      .orderBy('transaction.date', 'DESC')
      .getMany();
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    accountId?: string,
  ): Promise<Transaction[]> {
    let query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('account.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('transaction.date', 'DESC');

    if (accountId) {
      query = query.andWhere('account.id = :accountId', { accountId });
    }

    return query.getMany();
  }
}
