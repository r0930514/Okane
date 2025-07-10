import ApiService from './ApiService';

class WalletService {

    static handleError(error) {
        console.error('WalletService Error:', error);
        
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
            return { error: '權限不足' };
        case 404:
            return { error: '錢包不存在或無權限存取' };
        case 500:
            return { error: '伺服器錯誤，請稍後重試' };
        default:
            return { 
                error: error.response.data?.message || '發生錯誤，請稍後重試' 
            };
        }
    }

    /**
     * 建立新錢包
     * @param {Object} walletData - 錢包資料
     * @returns {Promise<Object>}
     */
    static async createWallet(walletData) {
        try {
            const res = await ApiService.axiosInstance.post('/wallets', walletData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得使用者的所有錢包
     * @returns {Promise<Object>}
     */
    static async getAllWallets() {
        try {
            const res = await ApiService.axiosInstance.get('/wallets');
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得使用者所有錢包及餘額
     * @returns {Promise<Object>}
     */
    static async getAllWalletsWithBalance() {
        try {
            const res = await ApiService.axiosInstance.get('/wallets/with-balance');
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得特定錢包詳細資訊
     * @param {number} id - 錢包 ID
     * @param {number} page - 頁數
     * @param {number} limit - 每頁筆數
     * @returns {Promise<Object>}
     */
    static async getWallet(id, page = 1, limit = 20) {
        try {
            const res = await ApiService.axiosInstance.get(`/wallets/${id}`, {
                params: { page, limit }
            });
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 更新錢包資訊
     * @param {number} id - 錢包 ID
     * @param {Object} updateData - 更新資料
     * @returns {Promise<Object>}
     */
    static async updateWallet(id, updateData) {
        try {
            const res = await ApiService.axiosInstance.patch(`/wallets/${id}`, updateData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 刪除錢包
     * @param {number} id - 錢包 ID
     * @returns {Promise<Object>}
     */
    static async deleteWallet(id) {
        try {
            const res = await ApiService.axiosInstance.delete(`/wallets/${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得錢包餘額
     * @param {number} id - 錢包 ID
     * @returns {Promise<Object>}
     */
    static async getWalletBalance(id) {
        try {
            const res = await ApiService.axiosInstance.get(`/wallets/${id}/balance`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default WalletService;
