// 交易相關類型定義

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  metadata: TransactionMetadata;
  walletId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionMetadata {
  // 原本的欄位現在都在 metadata 中
  type?: string;
  category?: string;
  relatedAsset?: string;
  relatedWalletId?: string;
  
  // 轉帳相關
  transferDirection?: 'in' | 'out';
  transferGroupId?: string;
  pairedTransactionId?: string;
  
  // 股票相關
  stockSymbol?: string;
  shares?: number;
  pricePerShare?: number;
  
  // 加密貨幣相關
  cryptoPair?: string;
  
  // 通用
  fees?: number;
  brokerOrderId?: string;
  exchangeRate?: number;
  originalAmount?: number;
  originalCurrency?: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  transferFee?: number;
  transferMethod?: string;
  
  // 應收應付相關
  customerName?: string;
  customerContact?: string;
  invoiceNumber?: string;
  dueDate?: string;
  creditTerms?: string;
  status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'bad_debt';
  paymentMethod?: string;
  collectedAmount?: number;
  remainingAmount?: number;
  overdaysDays?: number;
  
  // 其他擴展欄位
  [key: string]: unknown;
}

export interface CreateTransactionRequest {
  walletId: string;
  date?: Date | string;
  amount: number;
  description: string;
  metadata?: TransactionMetadata;
}

export interface UpdateTransactionRequest {
  date?: Date | string;
  amount?: number;
  description?: string;
  metadata?: TransactionMetadata;
}

// 為了向後相容，保留常用的交易類型常數
export const TransactionTypes = {
  Income: 'income',
  Expense: 'expense',
  Transfer: 'transfer',
  Buy: 'buy',
  Sell: 'sell',
  Dividend: 'dividend',
  Interest: 'interest',
  ReceivableCreate: 'receivable_create',
  ReceivableCollect: 'receivable_collect',
  ReceivableWriteOff: 'receivable_write_off',
  PayableCreate: 'payable_create',
  PayablePayment: 'payable_payment',
} as const;

export type TransactionType = typeof TransactionTypes[keyof typeof TransactionTypes];

export interface CreateTransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
  metadata?: TransactionMetadata;
}

export interface TransactionQuery {
  walletId?: string;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}