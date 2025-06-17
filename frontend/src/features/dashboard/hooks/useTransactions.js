import { useState, useEffect } from 'react';
import { TransactionService } from '../../../shared';

export const useTransactions = (walletId) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
    });

    const fetchTransactions = async (page = 1, limit = 20) => {
        if (!walletId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await TransactionService.getTransactionsByWallet(
                walletId, 
                page, 
                limit
            );
            
            if (result.success) {
                if (page === 1) {
                    setTransactions(result.data.transactions || []);
                } else {
                    setTransactions(prev => [...prev, ...(result.data.transactions || [])]);
                }
                
                setPagination({
                    page,
                    limit,
                    total: result.data.total || 0,
                    hasMore: (result.data.transactions?.length || 0) === limit
                });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('無法載入交易記錄');
        } finally {
            setLoading(false);
        }
    };

    const createTransaction = async (transactionData) => {
        const result = await TransactionService.createTransaction(walletId, transactionData);
        if (result.success) {
            await fetchTransactions(1); // 重新載入第一頁
        }
        return result;
    };

    const updateTransaction = async (id, updateData) => {
        const result = await TransactionService.updateTransaction(id, updateData);
        if (result.success) {
            await fetchTransactions(1); // 重新載入第一頁
        }
        return result;
    };

    const deleteTransaction = async (id) => {
        const result = await TransactionService.deleteTransaction(id);
        if (result.success) {
            await fetchTransactions(1); // 重新載入第一頁
        }
        return result;
    };

    const loadMore = () => {
        if (pagination.hasMore && !loading) {
            fetchTransactions(pagination.page + 1, pagination.limit);
        }
    };

    useEffect(() => {
        if (walletId) {
            fetchTransactions(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletId]);

    return {
        transactions,
        loading,
        error,
        pagination,
        refetch: () => fetchTransactions(1),
        createTransaction,
        updateTransaction,
        deleteTransaction,
        loadMore
    };
};
