'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/services/AuthService';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ApiResponse 
} from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<ApiResponse<{ access_token: string }>>;
  register: (data: RegisterData) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
  verifyEmailAndNavigate: (email: string) => Promise<ApiResponse<{ exists: boolean }>>;
  
  // Utility functions
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user has token
        if (!AuthService.hasAuthToken()) {
          setIsLoading(false);
          return;
        }

        // Verify token and get user info
        const response = await AuthService.verifyToken();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid, clear it
          AuthService.clearAuthToken();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<{ access_token: string }>> => {
    try {
      setIsLoading(true);
      clearError();

      const response = await AuthService.signin(credentials);
      
      if (response.success && response.data?.access_token) {
        // Get user info after successful login
        const userResponse = await AuthService.verifyToken();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          router.push('/dashboard');
        }
        return response;
      } else {
        const errorMsg = response.error || '登入失敗，請檢查您的密碼';
        handleError(errorMsg);
        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = '登入失敗，請檢查您的密碼';
      handleError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
    try {
      setIsLoading(true);
      clearError();

      const response = await AuthService.signup(data);
      
      if (response.success) {
        router.push('/login');
        return response;
      } else {
        const errorMsg = response.error || '註冊失敗，請重試';
        handleError(errorMsg);
        return response;
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = '註冊失敗，請重試';
      handleError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailAndNavigate = async (email: string): Promise<ApiResponse<{ exists: boolean }>> => {
    try {
      setIsLoading(true);
      clearError();

      const response = await AuthService.verifyEmail(email);
      
      if (response.success && response.data) {
        if (response.data.exists) {
          router.push(`/login/password?email=${encodeURIComponent(email)}`);
        } else {
          router.push(`/register?email=${encodeURIComponent(email)}`);
        }
        return response;
      } else {
        const errorMsg = response.error || '驗證過程中發生錯誤';
        handleError(errorMsg);
        return response;
      }
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMsg = '驗證過程中發生錯誤，請稍後再試';
      handleError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await AuthService.verifyToken();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    verifyEmailAndNavigate,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}