'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * 認證相關的自定義 Hook - 現在使用 AuthContext
 * 這個 hook 現在只是 AuthContext 的一個便捷包裝器
 */
export const useAuth = () => {
    return useAuthContext();
};