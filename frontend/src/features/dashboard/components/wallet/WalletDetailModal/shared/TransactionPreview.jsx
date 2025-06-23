import PropTypes from "prop-types";

export default function TransactionPreview({
    type,
    amount,
    category,
    date,
    description,
    currency,
    walletCurrency,
    exchangeRate,
    exchangeRateSource,
    amountInWalletCurrency,
}) {
    if (!amount) return null;
    const showConverted =
        currency &&
        walletCurrency &&
        currency !== walletCurrency &&
        amountInWalletCurrency;
    return (
        <div className="card card-border p-4 bg-base-200">
            <h4 className="font-medium mb-2">交易預覽</h4>
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>類型：</span>
                    <span
                        className={
                            type === "income" ? "text-success" : "text-error"
                        }
                    >
                        {type === "income" ? "收入" : "支出"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>金額：</span>
                    <span
                        className={
                            type === "income"
                                ? "text-success font-semibold"
                                : "text-error font-semibold"
                        }
                    >
                        {type === "income" ? "+" : "-"}$
                        {parseFloat(amount || 0).toLocaleString()}{" "}
                        {currency || ""}
                    </span>
                </div>
                {showConverted && (
                    <div className="flex justify-between">
                        <span>換算後金額：</span>
                        <span className="text-info font-semibold">
                            {type === "income" ? "+" : "-"}$
                            {parseFloat(
                                amountInWalletCurrency,
                            ).toLocaleString()}{" "}
                            {walletCurrency}
                        </span>
                    </div>
                )}
                {showConverted && (
                    <div className="flex justify-between">
                        <span>匯率/來源：</span>
                        <span className="text-xs">
                            1 {currency} = {exchangeRate} {walletCurrency} (
                            {exchangeRateSource})
                        </span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>分類：</span>
                    <span>{category || "未分類"}</span>
                </div>
                <div className="flex justify-between">
                    <span>日期：</span>
                    <span>{date}</span>
                </div>
                {description && (
                    <div className="flex justify-between">
                        <span>描述：</span>
                        <span>{description}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

TransactionPreview.propTypes = {
    type: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    currency: PropTypes.string,
    walletCurrency: PropTypes.string,
    exchangeRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    exchangeRateSource: PropTypes.string,
    amountInWalletCurrency: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
