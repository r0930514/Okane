import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column('jsonb')
  password: {
    hash: string;
    salt: string;
  };

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
