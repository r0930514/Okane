'use client';

import { useState } from 'react';
import { TrendUp, TrendDown, Wallet, Receipt, CurrencyDollar } from '@phosphor-icons/react';
import { useWalletStats } from '@/app/dashboard/hooks/useWalletStats';
import type { Wallet as WalletType } from '@/lib/types';

interface StatsOverviewProps {
    wallets: WalletType[];
}

export default function StatsOverview({ wallets }: StatsOverviewProps) {
    const { stats, loading, primaryCurrency, setPrimaryCurrency } = useWalletStats(wallets);
    const [showCurrencySelector, setShowCurrencySelector] = useState(false);
    
    // 支援的貨幣列表（簡化版，不使用 UserConfigService）
    const supportedCurrencies = [
        { code: 'TWD', name: '新台幣', symbol: 'NT$' },
        { code: 'USD', name: '美元', symbol: '$' },
        { code: 'JPY', name: '日圓', symbol: '¥' },
        { code: 'EUR', name: '歐元', symbol: '€' },
        { code: 'CNY', name: '人民幣', symbol: '¥' },
    ];

    const formatCurrency = (amount: number): string => {
        const currency = supportedCurrencies.find(c => c.code === primaryCurrency);
        const symbol = currency?.symbol || 'NT$';
        
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: primaryCurrency,
            currencyDisplay: 'symbol'
        }).format(amount).replace(/[A-Z]{3}/, symbol);
    };

    // 處理主貨幣切換
    const handleCurrencyChange = (newCurrency: string) => {
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

    interface StatCardProps {
        title: string;
        amount: number;
        icon: React.ComponentType<{ size: number; className?: string }>;
        color?: string;
    }

    const StatCard = ({ title, amount, icon: Icon, color = "text-gray-600" }: StatCardProps) => (
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