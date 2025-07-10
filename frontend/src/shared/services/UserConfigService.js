import ApiService from './ApiService';

/**
 * 用戶配置服務
 * 處理用戶偏好設定、主貨幣設定等用戶相關配置
 */
class UserConfigService {
    /**
     * 取得用戶偏好設定
     */
    static async getUserPreferences() {
        try {
            const response = await ApiService.axiosInstance.get('/users/preferences');
            return response.data;
        } catch (error) {
            console.error('Failed to get user preferences:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新用戶主貨幣設定
     */
    static async updatePrimaryCurrency(currency) {
        try {
            const response = await ApiService.axiosInstance.patch('/users/primary-currency', {
                primaryCurrency: currency
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update primary currency:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 更新用戶偏好設定
     */
    static async updateUserPreferences(preferences) {
        try {
            const response = await ApiService.axiosInstance.patch('/users/preferences', {
                preferences
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update user preferences:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 取得支援的貨幣列表
     */
    static getSupportedCurrencies() {
        return [
            { code: 'TWD', name: '新台幣 (TWD)', symbol: 'NT$' },
            { code: 'USD', name: '美元 (USD)', symbol: '$' },
            { code: 'EUR', name: '歐元 (EUR)', symbol: '€' },
            { code: 'JPY', name: '日圓 (JPY)', symbol: '¥' },
            { code: 'USDT', name: 'USDT', symbol: 'USDT' },
            { code: 'BTC', name: '比特幣 (BTC)', symbol: '₿' },
            { code: 'ETH', name: '以太幣 (ETH)', symbol: 'Ξ' },
        ];
    }

    /**
     * 取得貨幣格式化資訊
     */
    static getCurrencyInfo(currencyCode) {
        const currencies = this.getSupportedCurrencies();
        return currencies.find(c => c.code === currencyCode) || 
               { code: currencyCode, name: currencyCode, symbol: currencyCode };
    }

    /**
     * 格式化貨幣金額
     */
    static formatCurrency(amount, currencyCode) {
        const currency = this.getCurrencyInfo(currencyCode);
        
        // 對於加密貨幣，顯示更多小數位
        const isCrypto = ['BTC', 'ETH', 'USDT'].includes(currencyCode);
        const maximumFractionDigits = isCrypto ? 8 : 2;
        
        const formatted = new Intl.NumberFormat('zh-TW', {
            minimumFractionDigits: 0,
            maximumFractionDigits,
        }).format(amount);
        
        return `${currency.symbol} ${formatted}`;
    }
}

export default UserConfigService;