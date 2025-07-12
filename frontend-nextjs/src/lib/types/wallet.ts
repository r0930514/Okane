// 錢包相關類型定義

export enum WalletType {
  Cash = 'cash',
  Bank = 'bank',
  Stock = 'stock',
  Crypto = 'crypto',
  ForeignStock = 'foreign_stock',
  Card = 'card',
  Receivable = 'receivable',
  Payable = 'payable',
}

export interface Wallet {
  id: string;
  name: string;
  color?: string;
  currency?: string;
  type: WalletType;
  provider?: string;
  config?: WalletConfig;
  userId: string;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletConfig {
  accountNumber?: string;
  branchCode?: string;
  apiKey?: string;
  secretKey?: string;
  brokerCode?: string;
  exchangeCode?: string;
  defaultCreditTerms?: string;
  overdueThresholdDays?: number;
  badDebtThresholdDays?: number;
  autoReminder?: boolean;
  reminderDays?: number[];
  [key: string]: any;
}

export interface CreateWalletRequest {
  name: string;
  color?: string;
  currency?: string;
  type: WalletType;
  provider?: string;
  config?: WalletConfig;
}

export interface UpdateWalletRequest {
  name?: string;
  color?: string;
  currency?: string;
  provider?: string;
  config?: WalletConfig;
  isActive?: boolean;
}

export interface WalletBalance {
  walletId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}