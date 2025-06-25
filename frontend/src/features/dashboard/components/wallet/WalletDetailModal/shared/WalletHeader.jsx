import PropTypes from "prop-types";
import { ArrowsClockwiseIcon, PlusIcon } from "@phosphor-icons/react";
import { WALLET_TYPE_NAMES } from "../../../../constants/walletConstants";
import {
    formatConvertedCurrency,
    calcAverageCost,
} from "../../../../../../shared/utils/formatUtils";
import useExchangeRate from "../../../../../../shared/hooks/useExchangeRate";

export default function WalletHeader({
    wallet,
    onUpdateBalance,
    onAddTransaction,
}) {
    const walletColor = wallet.walletColor || "#10b981";

    const headerStyle = {
        backgroundColor: `${walletColor}20`, // 添加透明度，和 WalletListCard 一樣
        borderColor: `${walletColor}40`,
    };

    const primaryButtonStyle = {
        background: `linear-gradient(135deg, ${walletColor}, ${walletColor}dd)`,
        color: "white",
        border: "none",
        boxShadow: `0 2px 8px ${walletColor}40`,
    };

    const secondaryButtonStyle = {
        backgroundColor: `${walletColor}15`,
        color: walletColor,
        border: `1px solid ${walletColor}30`,
        backdropFilter: "blur(10px)",
    };

    // 取得匯率（1 主幣別 to 次要幣別）
    const { rate } = useExchangeRate({
        from: wallet.currency,
        to: wallet.secondaryCurrency,
        amount: 1,
    });

    // 計算平均成本（用工具函數）
    const avgCost = calcAverageCost(
        wallet.allTransactions,
        wallet.secondaryCurrency,
    );
    const shouldShowAvgCost =
        wallet.secondaryCurrency &&
        wallet.secondaryCurrency !== "" &&
        Array.isArray(wallet.allTransactions) &&
        avgCost > 0;
    // debug log
    console.log("[平均成本 debug]", {
        secondaryCurrency: wallet.secondaryCurrency,
        allTransactions: wallet.allTransactions,
        avgCost,
        shouldShowAvgCost,
    });

    return (
        <div
            className="h-full px-4 py-4 lg:px-8 lg:py-8 rounded-2xl flex flex-col lg:flex-col items-left justify-between border-1 border-base-content/20"
            style={headerStyle}
        >
            {/* 錢包資訊 - 小裝置水平佈局，大裝置垂直佈局 */}
            <div className="flex lg:flex-col items-center lg:items-start lg:text-left lg:mb-0">
                <div className="flex-1 lg:flex-none">
                    <p className="text-base-content/60 text-sm lg:text-base">
                        {WALLET_TYPE_NAMES[wallet.walletType] ||
                            wallet.walletType}
                    </p>
                    <h3 className="text-lg lg:text-2xl font-bold mb-0 lg:mb-1">
                        {wallet.walletName}
                    </h3>
                    {wallet.currency && (
                        <div className="mt-1">
                            <span className="badge badge-outline badge-sm lg:badge-md text-base-content/60 font-normal">
                                {wallet.currency}
                            </span>
                            {/* 顯示次要幣別與換算結果 */}
                            {wallet.secondaryCurrency &&
                                wallet.secondaryCurrency !== "" && (
                                <>
                                    <div className="text-xs text-base-content/50 mt-1">
                                        {formatConvertedCurrency(
                                            1,
                                            rate,
                                            wallet.currency,
                                            wallet.secondaryCurrency,
                                        )}
                                    </div>
                                    {shouldShowAvgCost && (
                                        <div className="text-xs text-info mt-1">
                                                平均成本：{avgCost.toFixed(4)}{" "}
                                            {wallet.currency}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* 手機版按鈕 - 在錢包名稱旁邊 */}
                <div className="flex gap-2 lg:hidden">
                    <button
                        className="btn btn-sm transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
                        style={primaryButtonStyle}
                        onClick={onUpdateBalance}
                    >
                        <ArrowsClockwiseIcon size={14} weight="bold" />
                    </button>
                    <button
                        className="btn btn-sm transition-all duration-200 hover:scale-105 flex items-center justify-center"
                        style={secondaryButtonStyle}
                        onClick={onAddTransaction}
                    >
                        <PlusIcon size={14} weight="bold" />
                    </button>
                </div>
            </div>

            {/* 桌面版按鈕 - 垂直佈局，顯示完整文字 */}
            <div className="hidden lg:flex flex-col gap-3">
                <button
                    className="btn btn-md w-full transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    style={primaryButtonStyle}
                    onClick={onUpdateBalance}
                >
                    <ArrowsClockwiseIcon size={16} weight="bold" />
                    更新餘額
                </button>
                <button
                    className="btn btn-md w-full transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    style={secondaryButtonStyle}
                    onClick={onAddTransaction}
                >
                    <PlusIcon size={16} weight="bold" />
                    新增記錄
                </button>
            </div>
        </div>
    );
}

WalletHeader.propTypes = {
    wallet: PropTypes.shape({
        walletName: PropTypes.string.isRequired,
        walletType: PropTypes.string.isRequired,
        walletColor: PropTypes.string,
        currency: PropTypes.string,
        secondaryCurrency: PropTypes.string,
        allTransactions: PropTypes.array,
    }).isRequired,
    onUpdateBalance: PropTypes.func.isRequired,
    onAddTransaction: PropTypes.func.isRequired,
};
