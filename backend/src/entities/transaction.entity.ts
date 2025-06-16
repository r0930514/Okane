import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum TransactionSource {
  Manual = 'manual',
  Sync = 'sync',
  Import = 'import',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transactionId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.Expense,
  })
  type: TransactionType;

  @Column({ nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: TransactionSource,
    default: TransactionSource.Manual,
  })
  source: TransactionSource;

  @Column({ nullable: true })
  externalTransactionId: string;

  @Column({ default: false })
  isReconciled: boolean;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  balanceAfter: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactionHistory)
  wallet: Wallet;
}
