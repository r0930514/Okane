import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @ApiProperty({
    description: '錢包唯一識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '錢包名稱',
    example: '台新銀行帳戶',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '錢包主要幣別',
    example: 'TWD',
  })
  @Column({ default: 'TWD' })
  currency: string;

  @ApiProperty({
    description: '錢包擴展資料（JSON 格式）',
    example: {},
    required: false,
  })
  @Column('jsonb', { nullable: true, default: '{}' })
  metadata: {
    [key: string]: any;
  };

  @ApiProperty({
    description: '錢包所有者',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @ApiProperty({
    description: '錢包交易歷史記錄',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactionHistory: Transaction[];

  @ApiProperty({
    description: '記錄建立時間',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '記錄最後更新時間',
    example: '2024-01-15T12:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
