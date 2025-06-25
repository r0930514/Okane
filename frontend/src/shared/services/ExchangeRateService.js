// 匯率服務，未來可串接後端或第三方（如國泰API）取得即時匯率
// 用法：ExchangeRateService.getRate('TWD', 'USD')

class ExchangeRateService {
    // 假資料，未來可改為 API 請求
    static fakeRates = {
        'TWD-USD': 0.032,
        'USD-TWD': 31.2,
        'TWD-JPY': 4.7,
        'JPY-TWD': 0.21,
        'USD-JPY': 155.5,
        'JPY-USD': 0.0064,
    };

    /**
   * 取得匯率
   * @param {string} from - 原始幣別（如 TWD）
   * @param {string} to - 目標幣別（如 USD）
   * @param {string} [dataSource] - 資料來源（如 'cathay'、'backend'），可為空，預留未來擴充
   * @returns {Promise<number>} 匯率
   */
    static async getRate(from, to, _dataSource) {
        void _dataSource; // 預留未來用途，消除 linter 警告
        const key = `${from}-${to}`;
        return this.fakeRates[key] || 1;
    }
}

export default ExchangeRateService; 