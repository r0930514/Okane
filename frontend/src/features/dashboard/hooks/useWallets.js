import { useState, useEffect } from 'react';
import { WalletService } from '../../../shared';

export const useWallets = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWallets = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await WalletService.getAllWalletsWithBalance();
            if (result.success) {
                const walletsWithBalance = result.data.map(wallet => ({
                    ...wallet,
                    balance: wallet.currentBalance
                }));
                setWallets(walletsWithBalance);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('無法載入錢包資料');
        } finally {
            setLoading(false);
        }
    };

    const createWallet = async (walletData) => {
        const result = await WalletService.createWallet(walletData);
        if (result.success) {
            await fetchWallets(); // 重新載入錢包列表
        }
        return result;
    };

    const updateWallet = async (id, updateData) => {
        const result = await WalletService.updateWallet(id, updateData);
        if (result.success) {
            await fetchWallets(); // 重新載入錢包列表
        }
        return result;
    };

    const deleteWallet = async (id) => {
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
