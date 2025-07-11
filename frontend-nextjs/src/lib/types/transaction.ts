// 交易相關類型定義

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
  Buy = 'buy',
  Sell = 'sell',
  Dividend = 'dividend',
  Interest = 'interest',
  ReceivableCreate = 'receivable_create',
  ReceivableCollect = 'receivable_collect',
  ReceivableWriteOff = 'receivable_write_off',
  PayableCreate = 'payable_create',
  PayablePayment = 'payable_payment',
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: TransactionType;
  category?: string;
  relatedAsset?: string;
  metadata?: TransactionMetadata;
  walletId: string;
  relatedWalletId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionMetadata {
  stockSymbol?: string;
  shares?: number;
  pricePerShare?: number;
  exchangeRate?: number;
  cryptoPair?: string;
  fees?: number;
  brokerOrderId?: string;
  transferDirection?: 'in' | 'out';
  originalAmount?: number;
  originalCurrency?: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  transferFee?: number;
  transferMethod?: string;
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
  [key: string]: any;
}

export interface CreateTransactionRequest {
  walletId: string;
  date?: Date | string;
  amount: number;
  description: string;
  type: TransactionType;
  category?: string;
  relatedAsset?: string;
  metadata?: TransactionMetadata;
  relatedWalletId?: string;
}

export interface UpdateTransactionRequest {
  date?: Date | string;
  amount?: number;
  description?: string;
  type?: TransactionType;
  category?: string;
  relatedAsset?: string;
  metadata?: TransactionMetadata;
}

export interface CreateTransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
  metadata?: TransactionMetadata;
}

export interface TransactionQuery {
  walletId?: string;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}