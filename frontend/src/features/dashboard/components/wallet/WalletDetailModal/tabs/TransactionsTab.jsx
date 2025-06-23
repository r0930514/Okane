import PropTypes from "prop-types";
import {
    formatCurrency,
    formatDate,
    getTransactionType,
    getTransactionDate,
    getTransactionDescription,
} from "../../../../../../shared/utils/formatUtils";

export default function TransactionsTab({
    walletStats,
    transactionsLoading,
    transactionsError,
    onEditTransaction,
}) {
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
                        {walletStats.allTransactions.map(
                            (transaction, index) => {
                                const transactionType =
                                    getTransactionType(transaction);
                                const transactionDate =
                                    getTransactionDate(transaction);
                                const transactionAmount =
                                    transaction.amount || 0;
                                const category = transaction.category;
                                const walletCurrency =
                                    walletStats?.currency ;
                                const showConverted =
                                    transaction.currency &&
                                    walletCurrency &&
                                    transaction.currency !== walletCurrency;
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
                                            {transactionType === "income"
                                                ? "+"
                                                : "-"}
                                            {formatCurrency(
                                                Math.abs(
                                                    parseFloat(
                                                        transactionAmount,
                                                    ) || 0,
                                                ),
                                            )}
                                            {transaction.currency &&
                                            transaction.currency !==
                                                walletCurrency
                                                ? ` ${transaction.currency}`
                                                : ""}
                                            {showConverted && (
                                                <div className="text-xs text-info font-normal mt-1 whitespace-nowrap self-end text-right">
                                                    {transactionType ===
                                                    "income"
                                                        ? "+"
                                                        : "-"}
                                                    {formatCurrency(
                                                        Math.abs(
                                                            parseFloat(
                                                                transaction.amountInWalletCurrency,
                                                            ) || 0,
                                                        ),
                                                    )}{" "}
                                                    {walletCurrency}
                                                    <span className="ml-1">
                                                        (1{" "}
                                                        {transaction.currency} ={" "}
                                                        {
                                                            transaction.exchangeRate
                                                        }{" "}
                                                        {/* {walletCurrency}
                                                        {transaction.exchangeRateSource
                                                            ? `, ${transaction.exchangeRateSource}`
                                                            : ""} */}
                                                        )
                                                    </span>
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
    }),
    onTransactionChange: PropTypes.func,
    onEditTransaction: PropTypes.func,
};
