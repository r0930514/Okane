import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import WalletIcon from './WalletIcon.jsx';

export default function WalletSummary() {
    // 模擬財務數據
    const [financialData] = useState({
        assets: 354600,
        liabilities: 85000,
        monthlyChange: 12500,
        changePercentage: 4.2,
        isPositiveChange: true
    });

    const [netWorth, setNetWorth] = useState(0);

    useEffect(() => {
        setNetWorth(financialData.assets - financialData.liabilities);
    }, [financialData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('NT$', '$');
    };

    const StatCard = ({ label, amount, color, trend = null }) => (
        <div className='flex h-full w-fit border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex-col py-4 px-6 w-fit'>
                <div className="text-gray-600 text-sm font-medium mb-1">{label}</div>
                <div className={`text-3xl font-bold ${color}`}>
                    {formatCurrency(amount)}
                </div>
                {/* {trend && (
                    <div className={`flex items-center gap-1 mt-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? <TrendUp size={16} /> : <TrendDown size={16} />}
                        {trend.percentage}% 本月
                    </div>
                )} */}
            </div>
        </div>
    );

    StatCard.propTypes = {
        label: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        trend: PropTypes.shape({
            isPositive: PropTypes.bool.isRequired,
            percentage: PropTypes.number.isRequired,
        }),
    };

    return (
        <div className="container px-6 pt-6">
            <div className="flex h-fit flex-wrap lg:flex-nowrap border border-gray-200 rounded-3xl bg-white shadow-lg">
                {/* 主要淨資產顯示 */}
                <div className="flex h-24 w-full m-6 gap-6 items-center">
                    <div className='flex gap-6 w-fit items-center'>
                        <WalletIcon />
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                            <div className="text-gray-600 text-base font-medium">淨資產</div>
                            <div className="text-gray-900 text-4xl font-bold">
                                {formatCurrency(netWorth)}
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${financialData.isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                                {financialData.isPositiveChange ? <TrendUp size={16} /> : <TrendDown size={16} />}
                                {formatCurrency(Math.abs(financialData.monthlyChange))} ({financialData.changePercentage}%) 本月
                            </div>
                        </div>
                    </div>
                </div>

                {/* 資產和負債統計 */}
                <div className="flex h-24 w-full m-6 justify-end items-center gap-4 overflow-x-auto">
                    <StatCard 
                        label="總資產" 
                        amount={financialData.assets} 
                        color="text-emerald-600"
                        trend={{
                            isPositive: true,
                            percentage: 2.8
                        }}
                    />
                    <StatCard 
                        label="總負債" 
                        amount={financialData.liabilities} 
                        color="text-red-600"
                        trend={{
                            isPositive: false,
                            percentage: 1.2
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
