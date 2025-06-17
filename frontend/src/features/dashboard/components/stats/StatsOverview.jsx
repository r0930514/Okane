import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendUp, TrendDown, Wallet, Receipt } from '@phosphor-icons/react';

export default function StatsOverview({ wallets }) {
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        transactionCount: 0,
        categoryStats: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateStats = async () => {
            if (!wallets.length) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || wallet.currentBalance || 0), 0);
                
                // 計算總資產和總負債
                const totalAssets = wallets
                    .filter(wallet => (wallet.balance || wallet.currentBalance || 0) > 0)
                    .reduce((sum, wallet) => sum + (wallet.balance || wallet.currentBalance || 0), 0);
                
                const totalLiabilities = Math.abs(wallets
                    .filter(wallet => (wallet.balance || wallet.currentBalance || 0) < 0)
                    .reduce((sum, wallet) => sum + (wallet.balance || wallet.currentBalance || 0), 0));
                
                setStats({
                    totalBalance,
                    totalAssets,
                    totalLiabilities,
                    transactionCount: 0,
                    categoryStats: []
                });
            } catch (error) {
                console.error('計算統計時發生錯誤:', error);
            } finally {
                setLoading(false);
            }
        };

        calculateStats();
    }, [wallets]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('NT$', '$');
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">財務概覽</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="淨資產"
                    amount={stats.totalBalance}
                    icon={Wallet}
                    color="text-blue-600"
                />
                <div className="hidden md:block">
                    <StatCard
                        title="總資產"
                        amount={stats.totalAssets}
                        icon={TrendUp}
                        color="text-green-600"
                    />
                </div>
                <div className="hidden md:block">
                    <StatCard
                        title="總負債"
                        amount={stats.totalLiabilities}
                        icon={TrendDown}
                        color="text-red-600"
                    />
                </div>
                <div className="hidden md:block">
                    <StatCard
                        title="交易筆數"
                        amount={stats.transactionCount}
                        icon={Receipt}
                        color="text-purple-600"
                    />
                </div>
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
