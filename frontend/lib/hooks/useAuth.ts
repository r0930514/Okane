'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/services/AuthService';
import type { LoginCredentials, RegisterData } from '@/lib/types';

/**
 * 認證相關的自定義 Hook (Next.js 版本)
 * 處理認證流程的業務邏輯和 UI 狀態管理
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // 清除錯誤訊息
    const clearError = useCallback(() => {
        setError('');
    }, []);

    // 設置錯誤訊息
    const handleError = useCallback((errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
    }, []);

    /**
     * 驗證電子郵件並導航到對應頁面
     * @param email - 電子郵件地址
     */
    const verifyEmailAndNavigate = useCallback(async (email: string) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.verifyEmail(email);
            
            if (result.success && result.data) {
                if (result.data.exists) {
                    // 使用者已存在，導航到密碼頁面
                    router.push(`/login/password?email=${encodeURIComponent(email)}`);
                } else {
                    // 使用者不存在，導航到註冊頁面
                    router.push(`/register?email=${encodeURIComponent(email)}`);
                }
                return { success: true };
            } else {
                const errorMsg = result.error || '驗證過程中發生錯誤';
                handleError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error('Email 驗證過程中發生錯誤:', error);
            const errorMsg = '驗證過程中發生錯誤，請稍後再試';
            handleError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    }, [router, clearError, handleError]);

    /**
     * 使用者登入並導航到儀表板
     * @param credentials - 登入憑證
     */
    const signinAndNavigate = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.signin(credentials);
            
            if (result.success && result.data?.access_token) {
                // 登入成功，導航到儀表板
                router.push('/dashboard');
                return { success: true };
            } else {
                const errorMsg = result.error || '登入失敗，請檢查您的密碼';
                handleError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error('登入過程中發生錯誤:', error);
            const errorMsg = '登入失敗，請檢查您的密碼';
            handleError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    }, [router, clearError, handleError]);

    /**
     * 使用者註冊並導航到首頁
     * @param userData - 註冊資料
     */
    const signupAndNavigate = useCallback(async (userData: RegisterData) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.signup(userData);
            
            if (result.success) {
                // 註冊成功，導航到首頁
                router.push('/');
                return { success: true };
            } else {
                const errorMsg = result.error || '註冊失敗，請重試';
                handleError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error('註冊過程中發生錯誤:', error);
            const errorMsg = '註冊失敗，請重試';
            handleError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    }, [router, clearError, handleError]);

    /**
     * 檢查 Token 有效性並可能導航到儀表板
     */
    const checkTokenAndNavigate = useCallback(async () => {
        try {
            // 首先檢查是否有 token
            if (!AuthService.hasAuthToken()) {
                return { success: false };
            }

            const result = await AuthService.verifyToken();
            
            if (result.success) {
                router.push('/dashboard');
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Token 驗證失敗:', error);
            return { success: false };
        }
    }, [router]);

    /**
     * 登出使用者
     */
    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
            router.push('/');
            return { success: true };
        } catch (error) {
            console.error('登出過程中發生錯誤:', error);
            return { success: false };
        }
    }, [router]);

    return {
        // 狀態
        isLoading,
        error,
        
        // 狀態管理函數
        setIsLoading,
        setError,
        clearError,
        handleError,
        
        // 認證相關的業務邏輯函數
        verifyEmailAndNavigate,
        signinAndNavigate,
        signupAndNavigate,
        checkTokenAndNavigate,
        logout
    };
};