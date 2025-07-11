import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from './wallet.entity';

@Entity()
export class User {
  @ApiProperty({
    description: '使用者唯一識別碼',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '使用者名稱',
    example: 'john_doe',
  })
  @Column({ length: 20 })
  username: string;

  @ApiProperty({
    description: '使用者電子郵件地址',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: '使用者密碼雜湊值和鹽值',
    example: {
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      salt: 'random_salt_value',
    },
  })
  @Column('jsonb', { select: false })
  password: {
    hash: string;
    salt: string;
  };

  @ApiProperty({
    description: '使用者主要幣別',
    example: 'TWD',
  })
  @Column({ length: 10, default: 'TWD' })
  primaryCurrency: string;

  @ApiProperty({
    description: '使用者個人偏好設定',
    example: {
      language: 'zh-TW',
      timezone: 'Asia/Taipei',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: 'zh-TW',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: true,
      },
    },
    required: false,
  })
  @Column('jsonb', { nullable: true })
  preferences: {
    language?: string;
    timezone?: string;
    dateFormat?: string;
    numberFormat?: string;
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };

  @ApiProperty({
    description: '使用者擁有的錢包列表',
    type: () => [Wallet],
  })
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
