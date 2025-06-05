export enum AccountType {
  Manual,
  Sync,
}
interface BaseAccountModule {
  id: number;
  accountName: string;
  accountNumber: string;
  transactionHistory: Transaction[];
  accountType: AccountType;
  accountColor?: string;
}
interface Transaction {
  transactionId: number;
  date: Date;
  amount: number;
  description: string;
}

export interface ManualAccount extends BaseAccountModule {}

export interface SyncAccount extends BaseAccountModule {
  sync: () => void;
  lastSynced: Date;
}
