import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

export enum WalletType {
  Manual = 'manual',
  Sync = 'sync',
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

  @Column({ type: 'timestamp', nullable: true })
  lastSynced: Date;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactionHistory: Transaction[];
}
