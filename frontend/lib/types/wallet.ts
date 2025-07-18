// 錢包相關類型定義

export interface Wallet {
  id: string;
  name: string;
  currency?: string;
  metadata: WalletMetadata;
  userId: string;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletMetadata {
  // 原本的欄位現在都在 metadata 中
  color?: string;
  type?: string;
  provider?: string;
  config?: WalletConfig;
  // 其他擴展欄位
  [key: string]: unknown;
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
  [key: string]: unknown;
}

export interface CreateWalletRequest {
  name: string;
  currency?: string;
  metadata?: WalletMetadata;
}

export interface UpdateWalletRequest {
  name?: string;
  currency?: string;
  metadata?: WalletMetadata;
  isActive?: boolean;
}

// 為了向後相容，保留常用的錢包類型常數
export const WalletTypes = {
  Cash: 'cash',
  Bank: 'bank',
  Stock: 'stock',
  Crypto: 'crypto',
  ForeignStock: 'foreign_stock',
  Card: 'card',
  Receivable: 'receivable',
  Payable: 'payable',
} as const;

export type WalletType = typeof WalletTypes[keyof typeof WalletTypes];

export interface WalletBalance {
  walletId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}