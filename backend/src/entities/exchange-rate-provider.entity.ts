import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';

@Entity('exchange_rate_providers')
export class ExchangeRateProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 200 })
  displayName: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  apiUrl: string;

  @Column('jsonb', { nullable: true })
  apiConfig: {
    apiKey?: string;
    headers?: Record<string, string>;
    rateLimit?: number;
    timeout?: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  priority: number;

  @Column({ default: 0 })
  reliabilityScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.provider)
  exchangeRates: ExchangeRate[];
}
