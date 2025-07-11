import ApiService from './ApiService';

class TransactionService {

    static handleError(error) {
        console.error('TransactionService Error:', error);
        
        if (error.code === 'ECONNABORTED') {
            return { error: '請求逾時，請檢查網路連線後重試' };
        }
    
        if (!error.response) {
            return { error: '網路連線異常，請稍後重試' };
        }

        switch (error.response.status) {
        case 401:
            return { error: '未授權，請重新登入' };
        case 403:
            return { error: '權限不足或無權限存取此交易記錄' };
        case 404:
            return { error: '錢包或交易記錄不存在' };
        case 500:
            return { error: '伺服器錯誤，請稍後重試' };
        default:
            return { 
                error: error.response.data?.message || '發生錯誤，請稍後重試' 
            };
        }
    }

    /**
     * 新增交易記錄
     * @param {Object} transactionData - 交易資料
     * @returns {Promise<Object>}
     */
    static async createTransaction(transactionData) {
        try {
            const res = await ApiService.axiosInstance.post(
                '/transactions', 
                transactionData
            );
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得所有交易記錄
     * @param {string} walletId - 錢包 ID (可選)
     * @returns {Promise<Object>}
     */
    static async getAllTransactions(walletId = null) {
        try {
            const params = walletId ? { walletId } : {};
            const res = await ApiService.axiosInstance.get(
                '/transactions',
                { params }
            );
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 根據分類取得交易
     * @param {string} category - 交易分類
     * @returns {Promise<Object>}
     */
    static async getTransactionsByCategory(category) {
        try {
            const res = await ApiService.axiosInstance.get(
                `/transactions/category/${category}`
            );
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得特定交易記錄
     * @param {string} id - 交易記錄 ID
     * @returns {Promise<Object>}
     */
    static async getTransaction(id) {
        try {
            const res = await ApiService.axiosInstance.get(`/transactions/${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 更新交易記錄
     * @param {string} id - 交易記錄 ID
     * @param {Object} updateData - 更新資料
     * @returns {Promise<Object>}
     */
    static async updateTransaction(id, updateData) {
        try {
            const res = await ApiService.axiosInstance.patch(
                `/transactions/${id}`, 
                updateData
            );
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 刪除交易記錄
     * @param {string} id - 交易記錄 ID
     * @returns {Promise<Object>}
     */
    static async deleteTransaction(id) {
        try {
            const res = await ApiService.axiosInstance.delete(`/transactions/${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 建立轉帳交易
     * @param {Object} transferData - 轉帳資料
     * @returns {Promise<Object>}
     */
    static async createTransfer(transferData) {
        try {
            const res = await ApiService.axiosInstance.post(
                '/transactions/transfer', 
                transferData
            );
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default TransactionService;
