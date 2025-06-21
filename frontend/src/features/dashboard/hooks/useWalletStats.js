import { useMemo } from 'react';
import { parseAmount, getTransactionType, getTransactionDate } from '../../../shared/utils/formatUtils';

/**
 * 計算錢包統計資訊的自定義 hook
 * @param {object} wallet - 錢包物件
 * @param {array} transactions - 交易記錄陣列
 * @returns {object} 包含統計資訊的物件
 */
export const useWalletStats = (wallet, transactions) => {
    const walletStats = useMemo(() => {
        if (!wallet || !transactions || !Array.isArray(transactions)) {
            return {
                income: 0,
                expense: 0,
                currentBalance: wallet?.balance || wallet?.currentBalance || 0,
                allTransactions: [],
                transactionCount: 0
            };
        }

        const income = transactions
            .filter(t => getTransactionType(t) === 'income')
            .reduce((sum, t) => sum + parseAmount(t.amount), 0);
        
        const expense = transactions
            .filter(t => getTransactionType(t) === 'expense')
            .reduce((sum, t) => sum + parseAmount(t.amount), 0);

        const allTransactions = [...transactions]
            .sort((a, b) => {
                const dateA = new Date(getTransactionDate(a));
                const dateB = new Date(getTransactionDate(b));
                return dateB - dateA;
            });

        // 使用後端計算好的餘額，不需要重新計算
        const currentBalance = wallet.currentBalance || wallet.balance || 0;

        return {
            income,
            expense,
            currentBalance,
            allTransactions,
            transactionCount: transactions.length
        };
    }, [wallet, transactions]);

    return walletStats;
};
