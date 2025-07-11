'use client';

import { useState, useEffect } from 'react';
import WalletService from '@/lib/services/WalletService';
import type { Wallet } from '@/lib/types';

export interface WalletStats {
    totalBalance: number;
    totalAssets: number;
    totalLiabilities: number;
    transactionCount: number;
    categoryStats: any[];
}

export interface UseWalletStatsReturn {
    stats: WalletStats;
    loading: boolean;
    error: string | null;
    primaryCurrency: string;
    setPrimaryCurrency: (currency: string) => void;
}

export const useWalletStats = (wallets: Wallet[]): UseWalletStatsReturn => {
    const [stats, setStats] = useState<WalletStats>({
        totalBalance: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        transactionCount: 0,
        categoryStats: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [primaryCurrency, setPrimaryCurrency] = useState('TWD');

    useEffect(() => {
        const calculateStats = async () => {
            if (!wallets.length) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                // 簡化版統計計算（不使用匯率轉換）
                let totalBalance = 0;
                let totalAssets = 0;
                let totalLiabilities = 0;

                wallets.forEach(wallet => {
                    const balance = wallet.balance || 0;
                    totalBalance += balance;
                    
                    if (balance > 0) {
                        totalAssets += balance;
                    } else {
                        totalLiabilities += Math.abs(balance);
                    }
                });
                
                setStats({
                    totalBalance,
                    totalAssets,
                    totalLiabilities,
                    transactionCount: 0, // 暫時設為0，等交易功能完成後再實作
                    categoryStats: []
                });
            } catch (err) {
                console.error('計算統計時發生錯誤:', err);
                setError('計算統計時發生錯誤');
            } finally {
                setLoading(false);
            }
        };

        calculateStats();
    }, [wallets, primaryCurrency]);

    return {
        stats,
        loading,
        error,
        primaryCurrency,
        setPrimaryCurrency
    };
};