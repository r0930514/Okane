import PropTypes from "prop-types"
import { UserConfigService } from "../../../../shared"

export default function WalletListCard({ name, balance, color = "#10b981", onClick, currency = "TWD", primaryCurrency = "TWD", convertedBalance = null }) {
    const cardStyle = {
        backgroundColor: `${color}20`, // 添加透明度
        borderColor: `${color}40`,
    }

    return (
        <div 
            className="px-6 py-4 rounded-2xl border transition-all duration-200 cursor-pointer inline-flex flex-col justify-center items-start gap-3 min-w-[180px] hover:shadow-md"
            style={cardStyle}
            onClick={onClick}
        >
            <div className="inline-flex justify-start items-center gap-4">
                <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="text-gray-700 text-base font-medium">
                        {name}
                    </div>
                    <div className="text-gray-900 text-2xl font-bold">
                        {currency === primaryCurrency ? (
                            // 與主貨幣相同：顯示主貨幣餘額
                            UserConfigService.formatCurrency(balance || 0, primaryCurrency)
                        ) : (
                            // 與主貨幣不同：顯示主貨幣餘額並在旁邊顯示原貨幣金額
                            <div className="flex flex-col">
                                <div className="text-2xl font-bold">
                                    {UserConfigService.formatCurrency(convertedBalance || 0, primaryCurrency)}
                                </div>
                                <div className="text-sm text-gray-500 font-normal">
                                    {UserConfigService.formatCurrency(balance || 0, currency)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

WalletListCard.propTypes = {
    color: PropTypes.string, // 支持任何 CSS 顏色值：hex, rgb, hsl, 顏色名稱等
    name: PropTypes.string.isRequired,
    balance: PropTypes.number,
    onClick: PropTypes.func,
    currency: PropTypes.string, // 錢包的貨幣
    primaryCurrency: PropTypes.string, // 主貨幣
    convertedBalance: PropTypes.number, // 轉換後的餘額（主貨幣）
}
