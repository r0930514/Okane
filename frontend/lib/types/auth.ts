// 認證相關類型定義

export interface User {
  id: string;
  username: string;
  email: string;
  primaryCurrency?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
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
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  exists: boolean;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  username: string;
  iat: number;
  exp: number;
}