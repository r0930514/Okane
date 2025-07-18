// 用戶相關類型定義
import { UserPreferences } from './auth';

export interface UserPreferencesResponse {
  primaryCurrency: string;
  preferences: UserPreferences;
}

export interface UpdatePrimaryCurrencyRequest {
  primaryCurrency: string;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}