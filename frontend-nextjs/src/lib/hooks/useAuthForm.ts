'use client';

import { useState } from 'react';

/**
 * 認證表單的自定義 Hook (Next.js 版本)
 * 提供通用的表單狀態管理和驗證邏輯
 */
export const useAuthForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 電子郵件格式驗證
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 密碼強度驗證（註冊用：至少6個字符）
    const validatePassword = (password: string): boolean => {
        return password && password.length >= 6;
    };

    // 使用者名稱驗證
    const validateUsername = (username: string): string | null => {
        if (username.length < 2) {
            return '使用者名稱至少需要 2 個字元';
        }
        if (username.length > 20) {
            return '使用者名稱不能超過 20 個字元';
        }
        return null;
    };

    // 處理鍵盤事件
    const createKeyPressHandler = (callback: () => void) => {
        return (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                callback();
            }
        };
    };

    // 清除錯誤訊息
    const clearError = () => setError('');

    // 錯誤處理工具函數
    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
    };

    // 驗證電子郵件並設置錯誤訊息
    const validateEmailWithError = (email: string, externalErrorHandler?: (error: string) => void): boolean => {
        const errorHandler = externalErrorHandler || setError;
        
        if (!email.trim()) {
            errorHandler('請輸入電子郵件地址');
            return false;
        }
        
        if (!validateEmail(email)) {
            errorHandler('請輸入有效的電子郵件地址');
            return false;
        }
        
        return true;
    };

    // 驗證密碼並設置錯誤訊息
    const validatePasswordWithError = (password: string): boolean => {
        if (!password.trim()) {
            setError('請輸入密碼');
            return false;
        }
        
        if (!validatePassword(password)) {
            setError('密碼至少需要6個字符');
            return false;
        }
        
        return true;
    };

    return {
        // 狀態
        isLoading,
        error,
        
        // 狀態設置函數
        setIsLoading,
        setError,
        clearError,
        
        // 驗證函數
        validateEmail,
        validatePassword,
        validateUsername,
        validateEmailWithError,
        validatePasswordWithError,
        
        // 工具函數
        createKeyPressHandler,
        handleError
    };
};