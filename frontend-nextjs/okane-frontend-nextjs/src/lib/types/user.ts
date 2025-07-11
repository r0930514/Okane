// 用戶相關類型定義

export interface UserPreferencesResponse {
  primaryCurrency: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  dateFormat?: string;
  numberFormat?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    reminders?: boolean;
  };
  dashboard?: {
    defaultView?: 'overview' | 'wallets' | 'transactions';
    showBalance?: boolean;
    currency?: string;
  };
  [key: string]: any;
}

export interface UpdatePrimaryCurrencyRequest {
  primaryCurrency: string;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}