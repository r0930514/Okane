// 帳戶相關類型定義（原錢包系統重構為帳戶系統）

// === 核心帳戶類型 ===
export interface Account {
  id: string;
  name: string;
  balance: number;
  availableBalance: number;
  currency: string;
  classification: 'asset' | 'liability';
  status: 'active' | 'draft' | 'disabled' | 'pending_deletion';
  type: 'bank' | 'cash' | 'crypto';
  accountableData: BankAccountData | CashAccountData | CryptoAccountData;
  createdAt?: string;
  updatedAt?: string;
}

// === 帳戶類型特定資料 ===
export interface BankAccountData {
  bankName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;
  bankAddress?: string;
}

export interface CashAccountData {
  location?: string;
  notes?: string;
}

export interface CryptoAccountData {
  walletAddress: string;
  network: string;
  protocol?: string;
  publicKey?: string;
  walletType?: string;
}

// === 建立帳戶請求 ===
export interface CreateAccountRequest {
  name: string;
  balance: number;
  availableBalance: number;
  currency: string;
  classification: 'asset' | 'liability';
  type: 'bank' | 'cash' | 'crypto';
  accountableData: BankAccountData | CashAccountData | CryptoAccountData;
}

export interface CreateBankAccountRequest {
  name: string;
  balance: number;
  currency: string;
  bankData: BankAccountData;
}

export interface CreateCashAccountRequest {
  name: string;
  balance: number;
  currency: string;
  cashData?: CashAccountData;
}

export interface CreateCryptoAccountRequest {
  name: string;
  balance: number;
  currency: string;
  cryptoData: CryptoAccountData;
}

// === 更新帳戶請求 ===
export interface UpdateAccountRequest {
  name?: string;
  balance?: number;
  availableBalance?: number;
  currency?: string;
  classification?: 'asset' | 'liability';
  status?: 'active' | 'draft' | 'disabled' | 'pending_deletion';
  accountableData?: BankAccountData | CashAccountData | CryptoAccountData;
}

export interface UpdateBankAccountRequest {
  name?: string;
  balance?: number;
  availableBalance?: number;
  currency?: string;
  status?: 'active' | 'draft' | 'disabled' | 'pending_deletion';
  bankData?: Partial<BankAccountData>;
}

export interface UpdateCashAccountRequest {
  name?: string;
  balance?: number;
  availableBalance?: number;
  currency?: string;
  status?: 'active' | 'draft' | 'disabled' | 'pending_deletion';
  cashData?: Partial<CashAccountData>;
}

export interface UpdateCryptoAccountRequest {
  name?: string;
  balance?: number;
  availableBalance?: number;
  currency?: string;
  status?: 'active' | 'draft' | 'disabled' | 'pending_deletion';
  cryptoData?: Partial<CryptoAccountData>;
}

// === 帳戶類型常數 ===
export const AccountTypes = {
  Bank: 'bank',
  Cash: 'cash',
  Crypto: 'crypto',
} as const;

export type AccountType = typeof AccountTypes[keyof typeof AccountTypes];

export const AccountStatus = {
  Active: 'active',
  Draft: 'draft',
  Disabled: 'disabled',
  PendingDeletion: 'pending_deletion',
} as const;

export type AccountStatusType = typeof AccountStatus[keyof typeof AccountStatus];

export const AccountClassification = {
  Asset: 'asset',
  Liability: 'liability',
} as const;

export type AccountClassificationType = typeof AccountClassification[keyof typeof AccountClassification];

// === 向後相容性別名 ===
// 保留原有 Wallet 相關類型以支援現有程式碼
export type Wallet = Account;
export type CreateWalletRequest = CreateAccountRequest;
export type UpdateWalletRequest = UpdateAccountRequest;
export type WalletType = AccountType;
export const WalletTypes = AccountTypes;

export interface WalletBalance {
  accountId: string; // 更新為 accountId
  balance: number;
  currency: string;
  lastUpdated: string;
}

