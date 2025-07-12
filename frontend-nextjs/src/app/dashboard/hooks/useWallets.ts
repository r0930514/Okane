'use client';

import { useState, useEffect } from 'react';
import WalletService from '@/lib/services/WalletService';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest, ApiResponse } from '@/lib/types';

export interface UseWalletsReturn {
    wallets: Wallet[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createWallet: (walletData: CreateWalletRequest) => Promise<ApiResponse<Wallet>>;
    updateWallet: (id: string, updateData: UpdateWalletRequest) => Promise<ApiResponse<Wallet>>;
    deleteWallet: (id: string) => Promise<ApiResponse<null>>;
}

export const useWallets = (): UseWalletsReturn => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWallets = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await WalletService.getAllWallets();
            if (result.success && result.data) {
                // 錢包資料現在已包含餘額，不需要額外查詢
                setWallets(result.data);
            } else {
                setError(result.error || '無法載入錢包資料');
            }
        } catch {
            setError('無法載入錢包資料');
        } finally {
            setLoading(false);
        }
    };

    const createWallet = async (walletData: CreateWalletRequest): Promise<ApiResponse<Wallet>> => {
        const result = await WalletService.createWallet(walletData);
        if (result.success) {
            await fetchWallets(); // 重新載入錢包列表
        }
        return result;
    };

    const updateWallet = async (id: string, updateData: UpdateWalletRequest): Promise<ApiResponse<Wallet>> => {
        const result = await WalletService.updateWallet(id, updateData);
        if (result.success) {
            await fetchWallets(); // 重新載入錢包列表
        }
        return result;
    };

    const deleteWallet = async (id: string): Promise<ApiResponse<null>> => {
        const result = await WalletService.deleteWallet(id);
        if (result.success) {
            await fetchWallets(); // 重新載入錢包列表
        }
        return result;
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return {
        wallets,
        loading,
        error,
        refetch: fetchWallets,
        createWallet,
        updateWallet,
        deleteWallet
    };
};