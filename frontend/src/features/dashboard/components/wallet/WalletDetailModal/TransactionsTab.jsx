import PropTypes from "prop-types";
import { TrendUpIcon, TrendDownIcon, CalendarIcon } from "@phosphor-icons/react";
import { formatCurrency, formatDate, getTransactionType, getTransactionDate, getTransactionDescription } from '../../../../../shared/utils/formatUtils';

export default function TransactionsTab({ 
    walletStats, 
    transactionsLoading, 
    transactionsError 
}) {
    if (transactionsLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (transactionsError) {
        return (
            <div className="text-center py-8 text-error">
                載入交易記錄時發生錯誤：{transactionsError}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 統計摘要
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-figure text-success">
                        <TrendUpIcon size={24} />
                    </div>
                    <div className="stat-title text-xs">總收入</div>
                    <div className="stat-value text-success text-lg">
                        {formatCurrency(walletStats?.income || 0)}
                    </div>
                </div>

                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-figure text-error">
                        <TrendDownIcon size={24} />
                    </div>
                    <div className="stat-title text-xs">總支出</div>
                    <div className="stat-value text-error text-lg">
                        {formatCurrency(walletStats?.expense || 0)}
                    </div>
                </div>

                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-figure text-info">
                        <CalendarIcon size={24} />
                    </div>
                    <div className="stat-title text-xs">交易筆數</div>
                    <div className="stat-value text-info text-lg">
                        {walletStats?.transactionCount || 0}
                    </div>
                </div>
            </div> */}

            {/* 交易記錄列表 */}
            <div className="card bg-base-100 p-4">
                {walletStats && walletStats.allTransactions.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {walletStats.allTransactions.map((transaction, index) => {
                            const transactionType = getTransactionType(transaction);
                            const transactionDate = getTransactionDate(transaction);
                            const transactionAmount = transaction.amount || 0;
                            
                            return (
                                <div key={transaction.id || index} className="flex justify-between items-center py-3 border-b border-base-300 last:border-b-0">
                                    <div>
                                        <div className="font-medium">
                                            {getTransactionDescription(transaction)}
                                        </div>
                                        <div className="text-sm text-base-content/60">
                                            {formatDate(transactionDate)}
                                        </div>
                                    </div>
                                    <div className={`font-semibold text-lg ${
                                        transactionType === 'income' ? 'text-success' : 'text-error'
                                    }`}>
                                        {transactionType === 'income' ? '+' : '-'}
                                        {formatCurrency(Math.abs(parseFloat(transactionAmount) || 0))}
                                    </div>
                                </div>
                            );
                        })}
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
        allTransactions: PropTypes.arrayOf(PropTypes.object)
    }),
    transactionsLoading: PropTypes.bool.isRequired,
    transactionsError: PropTypes.string
};
