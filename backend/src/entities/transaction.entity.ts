import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.entity';

@Entity()
export class Transaction {
  @ApiProperty({
    description: '交易唯一識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '交易發生日期時間',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({
    description: '交易金額（以錢包主幣別計算）',
    example: 1500.5,
  })
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: '交易描述或備註',
    example: '午餐費用',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: '交易擴展資料（JSON 格式）',
    example: {},
    required: false,
  })
  @Column('jsonb', { nullable: true, default: '{}' })
  metadata: {
    [key: string]: any;
  };

  @ApiProperty({
    description: '所屬帳戶',
    type: () => Account,
  })
  @ManyToOne(() => Account)
  account: Account;

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
