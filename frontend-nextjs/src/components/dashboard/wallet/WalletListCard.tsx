'use client';

interface WalletListCardProps {
    name: string;
    balance?: number;
    color?: string;
    onClick?: () => void;
    currency?: string;
    primaryCurrency?: string;
    convertedBalance?: number | null;
}

export default function WalletListCard({ 
    name, 
    balance = 0, 
    color = "#10b981", 
    onClick, 
    currency = "TWD", 
    primaryCurrency = "TWD", 
    convertedBalance = null 
}: WalletListCardProps) {
    const cardStyle = {
        backgroundColor: `${color}20`, // 添加透明度
        borderColor: `${color}40`,
    };

    // 簡化的貨幣格式化函數（替代 UserConfigService）
    const formatCurrency = (amount: number, currencyCode: string): string => {
        const currencySymbols: Record<string, string> = {
            TWD: 'NT$',
            USD: '$',
            JPY: '¥',
            EUR: '€',
            CNY: '¥',
        };

        const symbol = currencySymbols[currencyCode] || currencyCode;
        return `${symbol}${amount.toLocaleString('zh-TW')}`;
    };

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
                            formatCurrency(balance, primaryCurrency)
                        ) : (
                            // 與主貨幣不同：顯示主貨幣餘額並在旁邊顯示原貨幣金額
                            <div className="flex flex-col">
                                <div className="text-2xl font-bold">
                                    {formatCurrency(convertedBalance || 0, primaryCurrency)}
                                </div>
                                <div className="text-sm text-gray-500 font-normal">
                                    {formatCurrency(balance, currency)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}