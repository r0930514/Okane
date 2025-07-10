/**
 * 格式化貨幣顯示
 * @param {number|string} amount - 金額
 * @returns {string} 格式化後的貨幣字串
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount || 0);
};

/**
 * 格式化日期顯示
 * @param {string} dateString - 日期字串
 * @returns {string} 格式化後的日期字串
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

/**
 * 安全地解析金額，確保是數字
 * @param {number|string} amount - 金額
 * @returns {number} 解析後的數字
 */
export const parseAmount = (amount) => {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
        const parsed = parseFloat(amount);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

/**
 * 取得交易類型（支援多種欄位名稱）
 * @param {object} transaction - 交易物件
 * @returns {string} 交易類型
 */
export const getTransactionType = (transaction) => {
    return transaction.type || transaction.transactionType || 'expense';
};

/**
 * 取得交易日期（支援多種欄位名稱）
 * @param {object} transaction - 交易物件
 * @returns {string} 交易日期
 */
export const getTransactionDate = (transaction) => {
    return transaction.date || transaction.transactionDate;
};

/**
 * 取得交易描述（支援多種欄位名稱）
 * @param {object} transaction - 交易物件
 * @returns {string} 交易描述
 */
export const getTransactionDescription = (transaction) => {
    return transaction.description || transaction.note || '無描述';
};

/**
 * 格式化換算後的金額顯示
 * @param {number} amount - 原始金額
 * @param {number} rate - 匯率
 * @param {string} from - 主幣別
 * @param {string} to - 目標幣別
 * @returns {string} 例如：1,000 TWD ≈ 32.00 USD
 */
export const formatConvertedCurrency = (amount, rate, from, to) => {
    const fromStr = (amount || 0).toLocaleString();
    const converted = ((amount || 0) * (rate || 1)).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return `${fromStr} ${from} ≈ ${converted} ${to}`;
};

/**
 * 計算平均成本
 * @param {array} transactions - 交易陣列
 * @param {string} targetCurrency - 目標幣別（如 USD）
 * @returns {number} 平均成本（主幣別/目標幣別）
 */
export const calcAverageCost = (transactions, targetCurrency) => {
    if (!Array.isArray(transactions) || !targetCurrency) return 0;
    const buyTxs = transactions.filter(
        tx => tx.type === 'income' && tx.currency === targetCurrency && tx.amount > 0 && tx.amountInWalletCurrency > 0
    );
    const totalBase = buyTxs.reduce((sum, tx) => sum + Number(tx.amountInWalletCurrency), 0);
    const totalForeign = buyTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
    return totalForeign > 0 ? totalBase / totalForeign : 0;
};
