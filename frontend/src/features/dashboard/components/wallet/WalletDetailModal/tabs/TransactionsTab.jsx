import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
    formatCurrency,
    formatDate,
    getTransactionType,
    getTransactionDate,
    getTransactionDescription,
} from "../../../../../../shared/utils/formatUtils";
import { UserService, UserConfigService, ExchangeRateService } from "../../../../../../shared";

export default function TransactionsTab({
    walletStats,
    transactionsLoading,
    transactionsError,
    onEditTransaction,
    wallet,
}) {
    const [primaryCurrency, setPrimaryCurrency] = useState('TWD');
    const [convertedTransactions, setConvertedTransactions] = useState([]);
    
    // 載入用戶主貨幣設定
    useEffect(() => {
        const loadUserPreferences = async () => {
            try {
                const preferences = await UserService.getUserPreferences();
                if (preferences.success && preferences.data?.primaryCurrency) {
                    setPrimaryCurrency(preferences.data.primaryCurrency);
                }
            } catch (error) {
                console.log('無法載入用戶偏好設定，使用預設值');
            }
        };
        
        loadUserPreferences();
    }, []);
    
    // 轉換交易記錄金額
    useEffect(() => {
        const convertTransactions = async () => {
            if (!walletStats?.allTransactions?.length) return;
            
            try {
                const transactionsWithConversion = await Promise.all(
                    walletStats.allTransactions.map(async (transaction) => {
                        const transactionCurrency = transaction.currency || wallet?.currency || 'TWD';
                        
                        if (transactionCurrency === primaryCurrency) {
                            return {
                                ...transaction,
                                convertedAmount: transaction.amount,
                                needsConversion: false
                            };
                        }
                        
                        try {
                            const result = await ExchangeRateService.convertAmount(
                                Math.abs(transaction.amount || 0),
                                transactionCurrency,
                                primaryCurrency
                            );
                            
                            return {
                                ...transaction,
                                convertedAmount: result.success ? result.data.convertedAmount : Math.abs(transaction.amount || 0),
                                needsConversion: true,
                                originalCurrency: transactionCurrency
                            };
                        } catch (error) {
                            return {
                                ...transaction,
                                convertedAmount: Math.abs(transaction.amount || 0),
                                needsConversion: true,
                                originalCurrency: transactionCurrency
                            };
                        }
                    })
                );
                
                setConvertedTransactions(transactionsWithConversion);
            } catch (error) {
                console.error('轉換交易記錄失敗:', error);
                setConvertedTransactions(walletStats.allTransactions);
            }
        };
        
        convertTransactions();
    }, [walletStats?.allTransactions, primaryCurrency, wallet?.currency]);
    const handleTransactionClick = (transaction) => {
        onEditTransaction?.(transaction);
    };

    if (transactionsLoading) {
        return (
            <div className="flex justify-center items-center py-6 lg:py-8">
                <span className="loading loading-spinner loading-md lg:loading-lg"></span>
            </div>
        );
    }

    if (transactionsError) {
        return (
            <div className="text-center py-6 lg:py-8 text-error text-sm lg:text-base">
                載入交易記錄時發生錯誤：{transactionsError}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 交易記錄列表 */}
            <div className="card bg-base-100 pt-3 lg:p-4">
                {walletStats && walletStats.allTransactions.length > 0 ? (
                    <div className="overflow-y-auto">
                        <h4 className="font-semibold text-base mb-3 lg:mb-4">
                            共 {walletStats?.transactionCount || 0} 筆資料
                        </h4>
                        {(convertedTransactions.length > 0 ? convertedTransactions : walletStats.allTransactions).map(
                            (transaction, index) => {
                                const transactionType =
                                    getTransactionType(transaction);
                                const transactionDate =
                                    getTransactionDate(transaction);
                                const transactionAmount =
                                    transaction.amount || 0;
                                const category = transaction.category;
                                const originalCurrency = transaction.originalCurrency || transaction.currency || wallet?.currency || 'TWD';
                                const showOriginalCurrency = transaction.needsConversion && originalCurrency !== primaryCurrency;
                                
                                return (
                                    <div
                                        key={transaction.id || index}
                                        className="flex items-center py-3 border-b border-base-300 last:border-b-0 gap-2 lg:gap-3 cursor-pointer hover:bg-base-200 transition-colors"
                                        onClick={() =>
                                            handleTransactionClick(transaction)
                                        }
                                    >
                                        {/* 左側交易資訊 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                                <div className="font-medium text-base truncate">
                                                    {getTransactionDescription(
                                                        transaction,
                                                    )}
                                                </div>
                                                {category && (
                                                    <div className="badge badge-ghost badge-sm">
                                                        {category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm text-base-content/60">
                                                {formatDate(transactionDate)}
                                            </div>
                                        </div>
                                        {/* 右側金額 */}
                                        <div
                                            className={`font-semibold text-lg shrink-0 flex flex-col items-end ${
                                                transactionType === "income"
                                                    ? "text-success"
                                                    : "text-error"
                                            }`}
                                        >
                                            {showOriginalCurrency ? (
                                                // 顯示原始幣別金額和主貨幣轉換後金額
                                                <div className="flex flex-col items-end">
                                                    <div className="text-sm font-medium">
                                                        {UserConfigService.formatCurrency(
                                                            Math.abs(transactionAmount),
                                                            originalCurrency
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {transactionType === "income" ? "+" : "-"}
                                                        {UserConfigService.formatCurrency(
                                                            transaction.convertedAmount || Math.abs(transactionAmount),
                                                            primaryCurrency
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                // 只顯示主貨幣金額
                                                <div>
                                                    {transactionType === "income" ? "+" : "-"}
                                                    {UserConfigService.formatCurrency(
                                                        Math.abs(transactionAmount),
                                                        primaryCurrency
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-base-content/60">
                        尚無交易記錄
                    </div>
                )}
            </div>
        </div>
    );
}

TransactionsTab.propTypes = {
    walletStats: PropTypes.shape({
        income: PropTypes.number,
        expense: PropTypes.number,
        transactionCount: PropTypes.number,
        allTransactions: PropTypes.arrayOf(PropTypes.object),
        currency: PropTypes.string,
    }),
    transactionsLoading: PropTypes.bool.isRequired,
    transactionsError: PropTypes.string,
    wallet: PropTypes.shape({
        id: PropTypes.number,
        balance: PropTypes.number,
        currentBalance: PropTypes.number,
        currency: PropTypes.string,
    }),
    onTransactionChange: PropTypes.func,
    onEditTransaction: PropTypes.func,
};
