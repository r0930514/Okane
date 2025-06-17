import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WalletConfig } from './wallet-config.entity';

@Entity('wallet_modules')
export class WalletModule {
  @PrimaryGeneratedColumn()
  moduleId: number;

  @Column({ length: 100 })
  moduleName: string;

  @Column('jsonb', {
    comment: '存放該模組設定檔格式，如銀行帳號密碼或交易所Token的格式等',
  })
  moduleConfigFormat: object;

  @Column({ nullable: true, length: 255 })
  moduleCallURL: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => WalletConfig, (config) => config.walletModule)
  walletConfigs: WalletConfig[];
}
