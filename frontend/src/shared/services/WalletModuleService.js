import ApiService from './ApiService';

class WalletModuleService {

    static handleError(error) {
        console.error('WalletModuleService Error:', error);
        
        if (error.code === 'ECONNABORTED') {
            return { error: '請求逾時，請檢查網路連線後重試' };
        }
    
        if (!error.response) {
            return { error: '網路連線異常，請稍後重試' };
        }

        switch (error.response.status) {
        case 401:
            return { error: '未授權，請重新登入' };
        case 404:
            return { error: '錢包模組不存在' };
        case 500:
            return { error: '伺服器錯誤，請稍後重試' };
        default:
            return { 
                error: error.response.data?.message || '發生錯誤，請稍後重試' 
            };
        }
    }

    /**
     * 建立新錢包模組
     * @param {Object} moduleData - 模組資料
     * @returns {Promise<Object>}
     */
    static async createModule(moduleData) {
        try {
            const res = await ApiService.axiosInstance.post('/wallet-modules', moduleData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得所有錢包模組
     * @returns {Promise<Object>}
     */
    static async getAllModules() {
        try {
            const res = await ApiService.axiosInstance.get('/wallet-modules');
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得特定錢包模組
     * @param {number} id - 模組 ID
     * @returns {Promise<Object>}
     */
    static async getModule(id) {
        try {
            const res = await ApiService.axiosInstance.get(`/wallet-modules/${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 更新錢包模組
     * @param {number} id - 模組 ID
     * @param {Object} updateData - 更新資料
     * @returns {Promise<Object>}
     */
    static async updateModule(id, updateData) {
        try {
            const res = await ApiService.axiosInstance.patch(`/wallet-modules/${id}`, updateData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 刪除錢包模組
     * @param {number} id - 模組 ID
     * @returns {Promise<Object>}
     */
    static async deleteModule(id) {
        try {
            const res = await ApiService.axiosInstance.delete(`/wallet-modules/${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default WalletModuleService;
