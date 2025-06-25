import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { WalletConfig } from './wallet-config.entity';

export enum WalletType {
  Manual = 'manual',
  Sync = 'sync',
}

export enum WalletOperationMode {
  ManualOnly = 'manual_only',
  SyncOnly = 'sync_only',
  Hybrid = 'hybrid',
}

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletName: string;

  @Column()
  accountNumber: string;

  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.Manual,
  })
  walletType: WalletType;

  @Column({ nullable: true })
  walletColor: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  initialBalance: number;

  @Column({
    type: 'enum',
    enum: WalletOperationMode,
    default: WalletOperationMode.Hybrid,
  })
  operationMode: WalletOperationMode;

  @Column({ nullable: true })
  walletConfigId: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSynced: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ default: 'TWD' })
  currency: string;

  @Column({ default: '' })
  secondaryCurrency: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @ManyToOne(() => WalletConfig, { nullable: true })
  @JoinColumn({ name: 'walletConfigId' })
  walletConfig: WalletConfig;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactionHistory: Transaction[];
}
