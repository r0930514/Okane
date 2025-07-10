import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendUp, TrendDown, Wallet, Receipt, CurrencyDollar } from '@phosphor-icons/react';
import { ExchangeRateService, UserService, UserConfigService } from '../../../../shared';

export default function StatsOverview({ wallets }) {
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        transactionCount: 0,
        categoryStats: []
    });
    const [loading, setLoading] = useState(true);
    const [primaryCurrency, setPrimaryCurrency] = useState('TWD');
    const [showCurrencySelector, setShowCurrencySelector] = useState(false);
    
    // 支援的貨幣列表
    const supportedCurrencies = UserConfigService.getSupportedCurrencies();

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

    useEffect(() => {
        const calculateStats = async () => {
            if (!wallets.length) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                // 準備多幣別餘額轉換
                const walletAmounts = wallets.map(wallet => ({
                    amount: wallet.balance || wallet.initialBalance || 0,
                    currency: wallet.currency || 'TWD'
                }));

                // 使用批次轉換API計算主貨幣總額
                const conversionResult = await ExchangeRateService.batchConvertToTargetCurrency(
                    walletAmounts,
                    primaryCurrency
                );

                let totalBalance = 0;
                let totalAssets = 0;
                let totalLiabilities = 0;

                if (conversionResult.success) {
                    totalBalance = conversionResult.data.totalAmount;
                    
                    // 分別計算資產和負債
                    conversionResult.data.conversions.forEach(conversion => {
                        if (conversion.convertedAmount > 0) {
                            totalAssets += conversion.convertedAmount;
                        } else {
                            totalLiabilities += Math.abs(conversion.convertedAmount);
                        }
                    });
                } else {
                    // 如果API失敗，使用簡單加總作為備用
                    totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0);
                    totalAssets = wallets
                        .filter(wallet => (wallet.balance || wallet.initialBalance || 0) > 0)
                        .reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0);
                    totalLiabilities = Math.abs(wallets
                        .filter(wallet => (wallet.balance || wallet.initialBalance || 0) < 0)
                        .reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0));
                }
                
                setStats({
                    totalBalance,
                    totalAssets,
                    totalLiabilities,
                    transactionCount: 0,
                    categoryStats: []
                });
            } catch (error) {
                console.error('計算統計時發生錯誤:', error);
                // 使用備用計算方式
                const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0);
                const totalAssets = wallets
                    .filter(wallet => (wallet.balance || wallet.initialBalance || 0) > 0)
                    .reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0);
                const totalLiabilities = Math.abs(wallets
                    .filter(wallet => (wallet.balance || wallet.initialBalance || 0) < 0)
                    .reduce((sum, wallet) => sum + (wallet.balance || wallet.initialBalance || 0), 0));
                
                setStats({
                    totalBalance,
                    totalAssets,
                    totalLiabilities,
                    transactionCount: 0,
                    categoryStats: []
                });
            } finally {
                setLoading(false);
            }
        };

        calculateStats();
    }, [wallets, primaryCurrency]);

    const formatCurrency = (amount) => {
        return UserConfigService.formatCurrency(amount, primaryCurrency);
    };

    // 處理主貨幣切換
    const handleCurrencyChange = (newCurrency) => {
        setPrimaryCurrency(newCurrency);
        setShowCurrencySelector(false);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-xs p-6 border border-gray-200">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded-sm w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded-sm w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-sm w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const StatCard = ({ title, amount, icon: Icon, color = "text-gray-600" }) => (
        <div className="bg-white rounded-lg shadow-xs p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <Icon size={24} className={color} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(amount)}
            </div>
        </div>
    );

    StatCard.propTypes = {
        title: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        icon: PropTypes.elementType.isRequired,
        color: PropTypes.string
    };

    return (
        <div className="px-6 py-3">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">財務概覽</h2>
                
                {/* 主貨幣切換按鈕 */}
                <div className="relative">
                    <button
                        className="btn btn-sm btn-outline flex items-center gap-2"
                        onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                    >
                        <CurrencyDollar size={16} />
                        {supportedCurrencies.find(c => c.code === primaryCurrency)?.name || primaryCurrency}
                    </button>
                    
                    {showCurrencySelector && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-2">
                                {supportedCurrencies.map(currency => (
                                    <button
                                        key={currency.code}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                            currency.code === primaryCurrency ? 'bg-blue-50 text-blue-600' : ''
                                        }`}
                                        onClick={() => handleCurrencyChange(currency.code)}
                                    >
                                        <span className="flex items-center justify-between">
                                            <span>{currency.name}</span>
                                            <span className="text-sm text-gray-500">{currency.symbol}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="淨資產"
                    amount={stats.totalBalance}
                    icon={Wallet}
                    color="text-blue-600"
                />
                <StatCard
                    title="總資產"
                    amount={stats.totalAssets}
                    icon={TrendUp}
                    color="text-green-600"
                />
                <StatCard
                    title="總負債"
                    amount={stats.totalLiabilities}
                    icon={TrendDown}
                    color="text-red-600"
                />
                <StatCard
                    title="交易筆數"
                    amount={stats.transactionCount}
                    icon={Receipt}
                    color="text-purple-600"
                />
            </div>
        </div>
    );
}

StatsOverview.propTypes = {
    wallets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        balance: PropTypes.number,
    })).isRequired
};
