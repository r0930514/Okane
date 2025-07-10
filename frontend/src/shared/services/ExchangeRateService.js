import ApiService from "./ApiService";

// 匯率服務，支援多供應商匯率取得
class ExchangeRateService {
    /**
     * 取得最新匯率
     * @param {string} from - 原始幣別
     * @param {string} to - 目標幣別
     * @param {number} [providerId] - 指定供應商ID
     * @returns {Promise<object>} 匯率資料
     */
    static async getLatestRate(from, to, providerId = null) {
        try {
            const params = new URLSearchParams({ from, to });
            if (providerId) {
                params.append('providerId', providerId);
            }
            
            const response = await ApiService.axiosInstance.get(`/exchange-rates/latest?${params}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get latest rate:', error);
            // 返回假資料作為備用
            return this.getFallbackRate(from, to);
        }
    }

    /**
     * 取得多個供應商的匯率比較
     * @param {string} from - 原始幣別
     * @param {string} to - 目標幣別
     * @param {number} [limit] - 限制回傳數量
     * @returns {Promise<Array>} 多供應商匯率列表
     */
    static async getMultiProviderRates(from, to, limit = 5) {
        try {
            const params = new URLSearchParams({ from, to, limit: limit.toString() });
            const response = await ApiService.axiosInstance.get(`/exchange-rates/multi-provider?${params}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get multi-provider rates:', error);
            return { success: false, data: [] };
        }
    }

    /**
     * 轉換金額
     * @param {number} amount - 金額
     * @param {string} from - 原始幣別
     * @param {string} to - 目標幣別
     * @param {number} [providerId] - 指定供應商ID
     * @returns {Promise<object>} 轉換結果
     */
    static async convertAmount(amount, from, to, providerId = null) {
        try {
            const response = await ApiService.axiosInstance.post('/exchange-rates/convert', {
                amount,
                fromCurrency: from,
                toCurrency: to,
                providerId
            });
            return response.data;
        } catch (error) {
            console.error('Failed to convert amount:', error);
            // 使用假資料進行轉換
            const fallbackRate = await this.getFallbackRate(from, to);
            return {
                success: true,
                data: {
                    convertedAmount: amount * fallbackRate.rate,
                    rate: fallbackRate
                }
            };
        }
    }

    /**
     * 批次轉換金額到指定貨幣
     * @param {Array} amounts - 金額陣列 [{ amount, currency }]
     * @param {string} targetCurrency - 目標貨幣
     * @returns {Promise<object>} 批次轉換結果
     */
    static async batchConvertToTargetCurrency(amounts, targetCurrency) {
        try {
            const response = await ApiService.axiosInstance.post('/exchange-rates/batch-convert', {
                amounts,
                targetCurrency
            });
            return response.data;
        } catch (error) {
            console.error('Failed to batch convert:', error);
            // 使用假資料進行批次轉換
            return this.getFallbackBatchConvert(amounts, targetCurrency);
        }
    }

    /**
     * 取得假資料匯率 (備用)
     * @param {string} from - 原始幣別
     * @param {string} to - 目標幣別
     * @returns {object} 假匯率資料
     */
    static getFallbackRate(from, to) {
        const fakeRates = {
            'TWD-USD': 0.032,
            'USD-TWD': 31.2,
            'TWD-JPY': 4.7,
            'JPY-TWD': 0.21,
            'USD-JPY': 155.5,
            'JPY-USD': 0.0064,
            'TWD-EUR': 0.0298,
            'EUR-TWD': 33.5,
            'USDT-TWD': 31.0,
            'TWD-USDT': 0.0323,
            'BTC-TWD': 1350000,
            'TWD-BTC': 0.00000074,
            'ETH-TWD': 85000,
            'TWD-ETH': 0.0000118,
        };

        const key = `${from}-${to}`;
        const rate = fakeRates[key] || 1;
        
        return {
            success: true,
            data: {
                fromCurrency: from,
                toCurrency: to,
                rate: rate,
                timestamp: new Date().toISOString(),
                rateType: 'mid',
                provider: { name: 'fallback', displayName: '備用匯率' }
            }
        };
    }

    /**
     * 假資料批次轉換 (備用)
     */
    static async getFallbackBatchConvert(amounts, targetCurrency) {
        const conversions = [];
        let totalAmount = 0;

        for (const { amount, currency } of amounts) {
            if (currency === targetCurrency) {
                conversions.push({
                    originalAmount: amount,
                    originalCurrency: currency,
                    convertedAmount: amount,
                    rate: 1.0,
                });
                totalAmount += amount;
            } else {
                const rateResult = this.getFallbackRate(currency, targetCurrency);
                const convertedAmount = amount * rateResult.data.rate;
                conversions.push({
                    originalAmount: amount,
                    originalCurrency: currency,
                    convertedAmount: convertedAmount,
                    rate: rateResult.data.rate,
                });
                totalAmount += convertedAmount;
            }
        }

        return {
            success: true,
            data: { totalAmount, conversions }
        };
    }

    /**
     * 初始化假資料
     */
    static async initializeFakeData() {
        try {
            const response = await ApiService.axiosInstance.post('/exchange-rates/initialize-fake-data');
            return response.data;
        } catch (error) {
            console.error('Failed to initialize fake data:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 取得匯率 (向後相容的方法)
     * @deprecated 使用 getLatestRate 代替
     */
    static async getRate(from, to) {
        const result = await this.getLatestRate(from, to);
        return result.success ? result.data.rate : 1;
    }
}

export default ExchangeRateService; 