import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ExchangeRateProvider } from './exchange-rate-provider.entity';

@Entity('exchange_rates')
@Index(['fromCurrency', 'toCurrency', 'provider', 'timestamp'])
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  fromCurrency: string;

  @Column({ length: 10 })
  toCurrency: string;

  @Column('decimal', { precision: 20, scale: 8 })
  rate: number;

  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  bidRate: number;

  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  askRate: number;

  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  midRate: number;

  @Column({ default: 'mid' })
  rateType: 'bid' | 'ask' | 'mid' | 'spot';

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column('jsonb', { nullable: true })
  metadata: {
    spread?: number;
    volume?: number;
    change24h?: number;
    high24h?: number;
    low24h?: number;
    [key: string]: any;
  };

  @ManyToOne(() => ExchangeRateProvider, (provider) => provider.exchangeRates)
  @JoinColumn({ name: 'providerId' })
  provider: ExchangeRateProvider;

  @Column()
  providerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
