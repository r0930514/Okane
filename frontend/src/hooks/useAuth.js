import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * 認證相關的自定義 Hook
 * 處理認證流程的業務邏輯和 UI 狀態管理
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 清除錯誤訊息
    const clearError = useCallback(() => {
        setError('');
    }, []);

    // 設置錯誤訊息
    const handleError = useCallback((errorMessage) => {
        setError(errorMessage);
        setIsLoading(false);
    }, []);

    /**
     * 驗證電子郵件並導航到對應頁面
     * @param {string} email - 電子郵件地址
     */
    const verifyEmailAndNavigate = useCallback(async (email) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.verifyEmail(email);
            
            if (result.success) {
                if (result.exists) {
                    // 使用者已存在，導航到密碼頁面
                    navigate('password');
                } else {
                    // 使用者不存在，導航到註冊頁面
                    navigate('register');
                }
                return { success: true };
            } else if (result.error) {
                handleError(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Email 驗證過程中發生錯誤:', error);
            handleError('驗證過程中發生錯誤，請稍後再試');
            return { success: false, error: '驗證過程中發生錯誤，請稍後再試' };
        } finally {
            setIsLoading(false);
        }
    }, [navigate, clearError, handleError]);

    /**
     * 使用者登入並導航到儀表板
     * @param {string} email - 電子郵件地址
     * @param {string} password - 密碼
     */
    const signinAndNavigate = useCallback(async (email, password) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.signin(email, password);
            
            if (result.success && result.token) {
                // 儲存 token 並導航到儀表板
                AuthService.saveToken(result.token);
                navigate('/dashboard');
                return { success: true };
            } else if (result.error) {
                handleError(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('登入過程中發生錯誤:', error);
            handleError('登入失敗，請檢查您的密碼');
            return { success: false, error: '登入失敗，請檢查您的密碼' };
        } finally {
            setIsLoading(false);
        }
    }, [navigate, clearError, handleError]);

    /**
     * 使用者註冊並導航到首頁
     * @param {string} email - 電子郵件地址
     * @param {string} password - 密碼
     * @param {string} username - 使用者名稱
     */
    const signupAndNavigate = useCallback(async (email, password, username) => {
        setIsLoading(true);
        clearError();

        try {
            const result = await AuthService.signup(email, password, username);
            
            if (result.success) {
                // 註冊成功，導航到首頁
                navigate('/');
                return { success: true };
            } else if (result.error) {
                handleError(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('註冊過程中發生錯誤:', error);
            handleError('註冊失敗，請重試');
            return { success: false, error: '註冊失敗，請重試' };
        } finally {
            setIsLoading(false);
        }
    }, [navigate, clearError, handleError]);

    /**
     * 檢查 Token 有效性並可能導航到儀表板
     */
    const checkTokenAndNavigate = useCallback(async () => {
        try {
            const result = await AuthService.checkToken();
            
            if (result.success) {
                navigate('/dashboard');
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Token 驗證失敗:', error);
            return { success: false };
        }
    }, [navigate]);

    /**
     * 登出使用者
     */
    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
            navigate('/');
            return { success: true };
        } catch (error) {
            console.error('登出過程中發生錯誤:', error);
            return { success: false };
        }
    }, [navigate]);

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
