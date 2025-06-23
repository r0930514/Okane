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
