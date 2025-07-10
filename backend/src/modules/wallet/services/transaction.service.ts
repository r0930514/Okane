import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionType,
} from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(
    walletId: number,
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // 驗證錢包所有權
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId, user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${walletId} 不存在或無權限存取`);
    }

    // 計算交易後餘額
    const currentBalance = await this.getWalletBalance(walletId);
    const balanceChange =
      createTransactionDto.type === TransactionType.Income
        ? createTransactionDto.amount
        : -createTransactionDto.amount;

    // 確保數值計算的精度，避免浮點數問題
    const balanceAfter = Number((currentBalance + balanceChange).toFixed(2));

    // 幣別與匯率處理
    const transactionCurrency =
      createTransactionDto.currency || wallet.currency || 'TWD';
    const exchangeRate = createTransactionDto.exchangeRate || 1;
    const exchangeRateSource =
      createTransactionDto.exchangeRateSource || 'manual';
    // 換算後金額（以錢包主貨幣表示）
    const amountInWalletCurrency = Number(
      (createTransactionDto.amount * exchangeRate).toFixed(2),
    );

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      currency: transactionCurrency,
      exchangeRate,
      exchangeRateSource,
      amountInWalletCurrency,
      date: createTransactionDto.date
        ? new Date(createTransactionDto.date)
        : new Date(),
      balanceAfter,
      wallet: { id: walletId },
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAllByWallet(
    walletId: number,
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // 驗證錢包所有權
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId, user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${walletId} 不存在或無權限存取`);
    }

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { wallet: { id: walletId } },
        order: { date: 'DESC', createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      },
    );

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet', 'wallet.user'],
    });

    if (!transaction) {
      throw new NotFoundException(`交易記錄 ID ${id} 不存在`);
    }

    if (transaction.wallet.user.id !== userId) {
      throw new ForbiddenException('無權限存取此交易記錄');
    }

    return transaction;
  }

  async update(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    // 如果金額或類型有變化，需要重新計算餘額
    if (
      updateTransactionDto.amount !== undefined ||
      updateTransactionDto.type !== undefined
    ) {
      const walletId = transaction.wallet.id;

      // 移除舊交易的影響
      const oldBalance = await this.getWalletBalanceExcluding(walletId, id);

      // 計算新的餘額變化
      const newAmount =
        updateTransactionDto.amount ??
        parseFloat(transaction.amount.toString());
      const newType = updateTransactionDto.type ?? transaction.type;
      const balanceChange =
        newType === TransactionType.Income ? newAmount : -newAmount;

      // 確保數值計算的精度
      transaction.balanceAfter = Number(
        (oldBalance + balanceChange).toFixed(2),
      );
    }

    // 幣別與匯率處理
    if (updateTransactionDto.currency !== undefined) {
      transaction.currency = updateTransactionDto.currency;
    }
    if (updateTransactionDto.exchangeRate !== undefined) {
      transaction.exchangeRate = updateTransactionDto.exchangeRate;
    }
    if (updateTransactionDto.exchangeRateSource !== undefined) {
      transaction.exchangeRateSource = updateTransactionDto.exchangeRateSource;
    }
    // 若有金額或匯率或幣別變動，重新計算換算金額
    if (
      updateTransactionDto.amount !== undefined ||
      updateTransactionDto.exchangeRate !== undefined ||
      updateTransactionDto.currency !== undefined
    ) {
      const amount =
        updateTransactionDto.amount ??
        parseFloat(transaction.amount.toString());
      const exchangeRate =
        updateTransactionDto.exchangeRate ?? transaction.exchangeRate ?? 1;
      transaction.amountInWalletCurrency = Number(
        (amount * exchangeRate).toFixed(2),
      );
    }

    if (updateTransactionDto.date) {
      transaction.date = new Date(updateTransactionDto.date);
    }

    // 更新其他欄位
    if (updateTransactionDto.amount !== undefined) {
      transaction.amount = updateTransactionDto.amount;
    }
    if (updateTransactionDto.description !== undefined) {
      transaction.description = updateTransactionDto.description;
    }
    if (updateTransactionDto.type !== undefined) {
      transaction.type = updateTransactionDto.type;
    }
    if (updateTransactionDto.category !== undefined) {
      transaction.category = updateTransactionDto.category;
    }
    if (updateTransactionDto.transactionId !== undefined) {
      transaction.transactionId = updateTransactionDto.transactionId;
    }

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getWalletBalance(walletId: number): Promise<number> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${walletId} 不存在`);
    }

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN transaction.type = :income THEN transaction.amount ELSE -transaction.amount END)',
        'netAmount',
      )
      .where('transaction.walletId = :walletId', { walletId })
      .setParameter('income', TransactionType.Income)
      .getRawOne();

    // 確保數值類型轉換正確
    const netAmount = parseFloat(result.netAmount) || 0;
    const initialBalance = parseFloat(wallet.initialBalance.toString()) || 0;

    return Number((initialBalance + netAmount).toFixed(2));
  }

  private async getWalletBalanceExcluding(
    walletId: number,
    excludeTransactionId: number,
  ): Promise<number> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${walletId} 不存在`);
    }

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN transaction.type = :income THEN transaction.amount ELSE -transaction.amount END)',
        'netAmount',
      )
      .where('transaction.walletId = :walletId', { walletId })
      .andWhere('transaction.id != :excludeId', {
        excludeId: excludeTransactionId,
      })
      .setParameter('income', TransactionType.Income)
      .getRawOne();

    // 確保數值類型轉換正確
    const netAmount = parseFloat(result.netAmount) || 0;
    const initialBalance = parseFloat(wallet.initialBalance.toString()) || 0;

    return Number((initialBalance + netAmount).toFixed(2));
  }

  async getTransactionsByCategory(
    walletId: number,
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ category: string; totalAmount: number; count: number }[]> {
    // 驗證錢包所有權
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId, user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${walletId} 不存在或無權限存取`);
    }

    let query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .addSelect('COUNT(transaction.id)', 'count')
      .where('transaction.walletId = :walletId', { walletId })
      .andWhere('transaction.category IS NOT NULL')
      .groupBy('transaction.category')
      .orderBy('totalAmount', 'DESC');

    if (startDate) {
      query = query.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      query = query.andWhere('transaction.date <= :endDate', { endDate });
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      category: result.category,
      totalAmount: parseFloat(result.totalAmount),
      count: parseInt(result.count),
    }));
  }
}
