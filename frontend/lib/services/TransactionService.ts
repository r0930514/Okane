import ApiService from './ApiService';
import {
    ApiResponse,
    Transaction,
    TransactionType,
    TransactionTypes,
    CreateTransactionRequest,
    UpdateTransactionRequest,
    TransactionQuery
} from '@/lib/types';

class TransactionService {
    /**
     * 建立新交易記錄
     * @param transactionData - 交易資料
     * @returns Promise<ApiResponse<Transaction>>
     */
    static async createTransaction(transactionData: CreateTransactionRequest): Promise<ApiResponse<Transaction>> {
        const response = await ApiService.post<Transaction>('/transactions', transactionData, {
            cache: 'no-store'
        });

        // 成功建立後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('transactions');
            // revalidateTag(`wallet-transactions-${transactionData.walletId}`);
            // revalidateTag(`wallet-balance-${transactionData.walletId}`);
        }

        return response;
    }

    /**
     * 取得交易列表（支援查詢參數）
     * @param query - 查詢參數
     * @returns Promise<ApiResponse<Transaction[]>>
     */
    static async getAllTransactions(query: TransactionQuery = {}): Promise<ApiResponse<Transaction[]>> {
        const queryString = this.buildQueryString(query);
        const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
        
        return ApiService.get<Transaction[]>(endpoint, {
            tags: ['transactions'],
            revalidate: 30 // 30秒快取
        });
    }

    /**
     * 根據分類取得交易
     * @param category - 交易分類
     * @returns Promise<ApiResponse<Transaction[]>>
     */
    static async getTransactionsByCategory(category: string): Promise<ApiResponse<Transaction[]>> {
        return ApiService.get<Transaction[]>(`/transactions/category/${encodeURIComponent(category)}`, {
            tags: ['transactions', `transactions-category-${category}`],
            revalidate: 60 // 1分鐘快取
        });
    }

    /**
     * 取得特定交易記錄
     * @param id - 交易 ID
     * @returns Promise<ApiResponse<Transaction>>
     */
    static async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
        return ApiService.get<Transaction>(`/transactions/${id}`, {
            tags: ['transactions', `transaction-${id}`],
            revalidate: 30 // 30秒快取
        });
    }

    /**
     * 更新交易記錄
     * @param id - 交易 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Transaction>>
     */
    static async updateTransaction(id: string, updateData: UpdateTransactionRequest): Promise<ApiResponse<Transaction>> {
        const response = await ApiService.patch<Transaction>(`/transactions/${id}`, updateData, {
            cache: 'no-store'
        });

        // 成功更新後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('transactions');
            // revalidateTag(`transaction-${id}`);
        }

        return response;
    }

    /**
     * 刪除交易記錄
     * @param id - 交易 ID
     * @returns Promise<ApiResponse<null>>
     */
    static async deleteTransaction(id: string): Promise<ApiResponse<null>> {
        const response = await ApiService.delete<null>(`/transactions/${id}`, {
            cache: 'no-store'
        });

        // 成功刪除後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('transactions');
            // revalidateTag(`transaction-${id}`);
        }

        return response;
    }

    /**
     * 取得交易統計資料（客戶端計算）
     * @param transactions - 交易列表
     * @returns 統計資料
     */
    static calculateTransactionStats(transactions: Transaction[]): {
        totalIncome: number;
        totalExpense: number;
        netAmount: number;
        transactionCount: number;
        transactionsByType: Record<TransactionType, number>;
        transactionsByCategory: Record<string, number>;
    } {
        const stats = {
            totalIncome: 0,
            totalExpense: 0,
            netAmount: 0,
            transactionCount: transactions.length,
            transactionsByType: {} as Record<TransactionType, number>,
            transactionsByCategory: {} as Record<string, number>
        };

        transactions.forEach(transaction => {
            const transactionType = transaction.metadata?.type || '';
            
            // 計算收入和支出
            if (transactionType === TransactionTypes.Income) {
                stats.totalIncome += transaction.amount;
            } else if (transactionType === TransactionTypes.Expense) {
                stats.totalExpense += transaction.amount;
            }

            // 按類型統計
            stats.transactionsByType[transactionType as TransactionType] = 
                (stats.transactionsByType[transactionType as TransactionType] || 0) + 1;

            // 按分類統計
            const category = typeof transaction.metadata?.category === 'string'
                ? transaction.metadata.category
                : '未分類';
            stats.transactionsByCategory[category] =
                (stats.transactionsByCategory[category] || 0) + transaction.amount;
        });

        stats.netAmount = stats.totalIncome - stats.totalExpense;

        return stats;
    }

    /**
     * 建構查詢字串
     * @param query - 查詢參數
     * @returns 查詢字串
     */
    private static buildQueryString(query: TransactionQuery): string {
        const params = new URLSearchParams();
        
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return params.toString();
    }

    /**
     * 格式化交易資料以供顯示
     * @param transaction - 交易資料
     * @returns 格式化後的交易資料
     */
    static formatTransactionForDisplay(transaction: Transaction): {
        id: string;
        date: string;
        formattedDate: string;
        amount: number;
        formattedAmount: string;
        description: string;
        type: string;
        typeDisplay: string;
        category: string;
        isIncome: boolean;
        isExpense: boolean;
    } {
        const transactionType = transaction.metadata?.type || '';
        const isIncome = transactionType === TransactionTypes.Income;
        const isExpense = transactionType === TransactionTypes.Expense;

        const typeDisplayMap: Record<string, string> = {
            [TransactionTypes.Income]: '收入',
            [TransactionTypes.Expense]: '支出',
            [TransactionTypes.Buy]: '買入',
            [TransactionTypes.Sell]: '賣出',
            [TransactionTypes.Dividend]: '股息',
            [TransactionTypes.Interest]: '利息',
            [TransactionTypes.ReceivableCreate]: '應收帳款',
            [TransactionTypes.ReceivableCollect]: '收款',
            [TransactionTypes.ReceivableWriteOff]: '呆帳沖銷',
            [TransactionTypes.PayableCreate]: '應付帳款',
            [TransactionTypes.PayablePayment]: '付款'
        };

        return {
            id: transaction.id,
            date: transaction.date,
            formattedDate: new Date(transaction.date).toLocaleDateString('zh-TW'),
            amount: transaction.amount,
            formattedAmount: new Intl.NumberFormat('zh-TW', {
                style: 'currency',
                currency: 'TWD'
            }).format(transaction.amount),
            description: transaction.description,
            type: transactionType as string,
            typeDisplay: typeDisplayMap[transactionType as TransactionType] || (transactionType as string),
            category: typeof transaction.metadata?.category === 'string'
                ? transaction.metadata.category
                : '未分類',
            isIncome,
            isExpense
        };
    }
}

export default TransactionService;