import axios from 'axios';
import ConfigService from './ConfigService';

class WalletConfigService {
    static configInstance = axios.create({
        baseURL: `${ConfigService.baseURL}wallet-configs/`,
        timeout: 10000,
    });

    static {
        // 設置 request interceptor 來添加 Authorization header
        this.configInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    static handleError(error) {
        console.error('WalletConfigService Error:', error);
        
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
            return { error: '錢包設定檔不存在或錢包模組不存在' };
        case 500:
            return { error: '伺服器錯誤，請稍後重試' };
        default:
            return { 
                error: error.response.data?.message || '發生錯誤，請稍後重試' 
            };
        }
    }

    /**
     * 建立新錢包設定檔
     * @param {Object} configData - 設定檔資料
     * @returns {Promise<Object>}
     */
    static async createConfig(configData) {
        try {
            const res = await this.configInstance.post('', configData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得使用者的所有錢包設定檔
     * @returns {Promise<Object>}
     */
    static async getAllConfigs() {
        try {
            const res = await this.configInstance.get('');
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 取得特定錢包設定檔
     * @param {number} id - 設定檔 ID
     * @returns {Promise<Object>}
     */
    static async getConfig(id) {
        try {
            const res = await this.configInstance.get(`${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 更新錢包設定檔
     * @param {number} id - 設定檔 ID
     * @param {Object} updateData - 更新資料
     * @returns {Promise<Object>}
     */
    static async updateConfig(id, updateData) {
        try {
            const res = await this.configInstance.patch(`${id}`, updateData);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * 刪除錢包設定檔
     * @param {number} id - 設定檔 ID
     * @returns {Promise<Object>}
     */
    static async deleteConfig(id) {
        try {
            const res = await this.configInstance.delete(`${id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default WalletConfigService;
