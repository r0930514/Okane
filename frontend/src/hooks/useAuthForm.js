import { useState } from 'react';

/**
 * 認證表單的自定義 Hook
 * 提供通用的表單狀態管理和驗證邏輯
 */
export const useAuthForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // 電子郵件格式驗證
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 密碼強度驗證（至少8個字符）
    const validatePassword = (password) => {
        return password && password.length >= 8;
    };

    // 處理電子郵件輸入框焦點事件
    const handleEmailFocus = () => setEmailFocused(true);
    const handleEmailBlur = () => setEmailFocused(false);

    // 處理密碼輸入框焦點事件
    const handlePasswordFocus = () => setPasswordFocused(true);
    const handlePasswordBlur = () => setPasswordFocused(false);

    // 處理鍵盤事件
    const createKeyPressHandler = (callback) => {
        return (e) => {
            if (e.key === 'Enter') {
                callback();
            }
        };
    };

    // 清除錯誤訊息
    const clearError = () => setError('');

    // 錯誤處理工具函數
    const handleError = (errorMessage) => {
        setError(errorMessage);
        setIsLoading(false);
    };

    // 驗證電子郵件並設置錯誤訊息
    const validateEmailWithError = (email) => {
        if (!email.trim()) {
            setError('請輸入電子郵件地址');
            return false;
        }
        
        if (!validateEmail(email)) {
            setError('請輸入有效的電子郵件地址');
            return false;
        }
        
        return true;
    };

    // 驗證密碼並設置錯誤訊息
    const validatePasswordWithError = (password) => {
        if (!password.trim()) {
            setError('請輸入密碼');
            return false;
        }
        
        if (!validatePassword(password)) {
            setError('密碼至少需要8個字符');
            return false;
        }
        
        return true;
    };

    return {
        // 狀態
        isLoading,
        error,
        emailFocused,
        passwordFocused,
        
        // 狀態設置函數
        setIsLoading,
        setError,
        clearError,
        
        // 焦點處理函數
        handleEmailFocus,
        handleEmailBlur,
        handlePasswordFocus,
        handlePasswordBlur,
        
        // 驗證函數
        validateEmail,
        validatePassword,
        validateEmailWithError,
        validatePasswordWithError,
        
        // 工具函數
        createKeyPressHandler,
        handleError
    };
};
