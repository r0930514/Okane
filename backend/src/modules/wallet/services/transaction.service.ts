import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { Account } from '../../../entities/account.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
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

    Object.assign(transaction, updateTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionRepository.remove(transaction);
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
