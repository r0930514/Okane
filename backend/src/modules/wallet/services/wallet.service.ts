import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';
import { Transaction, TransactionType } from '../../../entities/transaction.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(userId: number, createWalletDto: CreateWalletDto): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      ...createWalletDto,
      accountNumber: createWalletDto.accountNumber || `WALLET-${Date.now()}`,
      user: { id: userId },
    });

    return await this.walletRepository.save(wallet);
  }

  async findAllByUser(userId: number): Promise<Wallet[]> {
    return await this.walletRepository.find({
      where: { user: { id: userId } },
      relations: ['transactionHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['transactionHistory'],
    });

    if (!wallet) {
      throw new NotFoundException(`錢包 ID ${id} 不存在或無權限存取`);
    }

    return wallet;
  }

  async update(id: number, userId: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const wallet = await this.findOne(id, userId);
    
    Object.assign(wallet, updateWalletDto);
    
    return await this.walletRepository.save(wallet);
  }

  async remove(id: number, userId: number): Promise<void> {
    const wallet = await this.findOne(id, userId);
    
    // 檢查是否有交易記錄
    const transactionCount = await this.transactionRepository.count({
      where: { wallet: { id } },
    });

    if (transactionCount > 0) {
      throw new ForbiddenException('無法刪除有交易記錄的錢包');
    }

    await this.walletRepository.remove(wallet);
  }

  async getBalance(walletId: number, userId: number): Promise<{ balance: number; walletName: string }> {
    const wallet = await this.findOne(walletId, userId);
    
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(CASE WHEN transaction.type = :income THEN transaction.amount ELSE -transaction.amount END)', 'netAmount')
      .where('transaction.walletId = :walletId', { walletId })
      .setParameter('income', TransactionType.Income)
      .getRawOne();

    // 確保數值類型轉換正確
    const netAmount = parseFloat(result.netAmount) || 0;
    const initialBalance = parseFloat(wallet.initialBalance.toString()) || 0;
    const balance = initialBalance + netAmount;

    return {
      balance: Number(balance.toFixed(2)), // 確保精度並轉換為數字
      walletName: wallet.walletName,
    };
  }

  async getWalletWithTransactions(
    walletId: number,
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    wallet: Wallet;
    transactions: Transaction[];
    total: number;
    balance: number;
  }> {
    const wallet = await this.findOne(walletId, userId);
    
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { wallet: { id: walletId } },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const { balance } = await this.getBalance(walletId, userId);

    return {
      wallet,
      transactions,
      total,
      balance,
    };
  }

  async getAllWalletsWithBalance(userId: number): Promise<Array<Wallet & { currentBalance: number }>> {
    const wallets = await this.findAllByUser(userId);
    
    const walletsWithBalance = await Promise.all(
      wallets.map(async (wallet) => {
        const { balance } = await this.getBalance(wallet.id, userId);
        return {
          ...wallet,
          currentBalance: balance,
        };
      })
    );

    return walletsWithBalance;
  }
}
