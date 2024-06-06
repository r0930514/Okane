/*FIXME:
  以下程式碼為自動生成程式碼 僅供參考
 */

interface BankAccount {
  accountNumber: string;
  accountName: string;
  balance: number;
  // Add more properties as needed
}

type BankAccountData = {
  [key: string]: BankAccount;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bankAccounts: BankAccountData = {
  account1: {
    accountNumber: '123456789',
    accountName: 'John Doe',
    balance: 1000,
  },
  account2: {
    accountNumber: '987654321',
    accountName: 'Jane Smith',
    balance: 500,
  },
};
