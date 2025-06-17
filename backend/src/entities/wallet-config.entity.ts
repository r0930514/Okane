import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WalletModule } from './wallet-module.entity';
import { User } from './user.entity';

@Entity('wallet_config')
export class WalletConfig {
  @PrimaryGeneratedColumn()
  configId: number;

  @Column()
  moduleId: number;

  @Column()
  userId: number;

  @Column('jsonb', {
    comment:
      '以關聯之錢包模組Format所存放之設定檔，如銀行帳號密碼或交易所Token等',
  })
  moduleConfigData: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => WalletModule, (module) => module.walletConfigs)
  @JoinColumn({ name: 'moduleId' })
  walletModule: WalletModule;

  @ManyToOne(() => User, (user) => user.walletConfigs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
