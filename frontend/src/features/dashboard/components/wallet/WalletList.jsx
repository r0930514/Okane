import { CaretRight, Plus } from "@phosphor-icons/react";
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import WalletListCard from "./WalletListCard";
import WalletDetailModal from "./WalletDetailModal/index";
import { useWallets } from "../../hooks/useWallets.js";
import { ExchangeRateService, UserService } from "../../../../shared";

export default function WalletList() {
    const { wallets, loading, error, refetch } = useWallets();

    // Modal 狀態管理
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 主貨幣狀態
    const [primaryCurrency, setPrimaryCurrency] = useState('TWD');
    const [convertedWallets, setConvertedWallets] = useState([]);
    const [isConverting, setIsConverting] = useState(false);

    // 分類類型對應的中文名稱
    const categoryNames = {
        manual: "手動帳戶",
        sync: "同步帳戶",
        crypto: "加密貨幣",
        bank: "銀行帳戶",
        credit: "信用卡",
        investment: "投資帳戶",
        savings: "儲蓄帳戶",
        cash: "現金帳戶",
    };

    // 動態根據錢包類型分組，只包含有錢包的分類
    const groupedWallets = useMemo(() => {
        const groups = {};
        const walletsToUse = convertedWallets.length > 0 ? convertedWallets : wallets;

        walletsToUse.forEach((wallet) => {
            const walletType = wallet.walletType || "manual"; // 預設為 manual

            if (!groups[walletType]) {
                groups[walletType] = [];
            }

            groups[walletType].push(wallet);
        });

        return groups;
    }, [wallets, convertedWallets]);

    // 取得有錢包的分類列表
    const availableCategories = Object.keys(groupedWallets);
    
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
    
    // 進行貨幣轉換
    useEffect(() => {
        const convertWalletBalances = async () => {
            if (!wallets.length || !primaryCurrency) return;
            
            setIsConverting(true);
            try {
                const walletAmounts = wallets.map(wallet => ({
                    amount: wallet.balance || wallet.initialBalance || 0,
                    currency: wallet.currency || 'TWD',
                    walletId: wallet.id
                }));
                
                const conversionResult = await ExchangeRateService.batchConvertToTargetCurrency(
                    walletAmounts,
                    primaryCurrency
                );
                
                if (conversionResult.success) {
                    const walletsWithConversion = wallets.map(wallet => {
                        const conversion = conversionResult.data.conversions.find(
                            c => c.originalCurrency === (wallet.currency || 'TWD') &&
                                 c.originalAmount === (wallet.balance || wallet.initialBalance || 0)
                        );
                        
                        return {
                            ...wallet,
                            convertedBalance: conversion?.convertedAmount || (wallet.balance || wallet.initialBalance || 0)
                        };
                    });
                    
                    setConvertedWallets(walletsWithConversion);
                } else {
                    setConvertedWallets(wallets);
                }
            } catch (error) {
                console.error('貨幣轉換失敗:', error);
                setConvertedWallets(wallets);
            } finally {
                setIsConverting(false);
            }
        };
        
        convertWalletBalances();
    }, [wallets, primaryCurrency]);

    const handleWalletClick = (wallet) => {
        setSelectedWallet(wallet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWallet(null);
        // 重新獲取錢包資料以更新餘額
        refetch();
    };

    const handleAddWallet = (category) => {
        // 這裡之後可以打開新增錢包的模態框
    };

    if (loading || isConverting) {
        return (
            <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    const WalletSection = ({ title, wallets, category }) => (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between h-12 px-6 lg:px-6">
                <div className="flex items-center gap-2">
                    <div className="text-start justify-start text-2xl font-semibold text-base-content">
                        {title}
                    </div>
                    <CaretRight size={24} className="text-gray-400" />
                </div>
                <button
                    className="btn btn-ghost btn-sm gap-2"
                    onClick={() => handleAddWallet(category)}
                >
                    <Plus size={16} />
                    新增
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 pl-6 lg:pl-6 pr-0">
                {wallets.map((wallet) => (
                    <WalletListCard
                        key={wallet.id}
                        name={wallet.walletName}
                        balance={wallet.balance || wallet.currentBalance || 0}
                        color={wallet.walletColor || "#10b981"}
                        onClick={() => handleWalletClick(wallet)}
                        currency={wallet.currency || 'TWD'}
                        primaryCurrency={primaryCurrency}
                        convertedBalance={wallet.convertedBalance}
                    />
                ))}
            </div>
        </div>
    );

    WalletSection.propTypes = {
        title: PropTypes.string.isRequired,
        wallets: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                walletName: PropTypes.string.isRequired,
                balance: PropTypes.number,
                walletColor: PropTypes.string.isRequired,
            }),
        ).isRequired,
        category: PropTypes.string.isRequired,
    };

    return (
        <>
            <div className="flex flex-col w-full h-full overflow-y-auto py-4 gap-6">
                {availableCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-3 lg:px-6">
                        <div className="text-lg font-medium text-base-content/60 mb-2">
                            還沒有任何錢包
                        </div>
                        <div className="text-sm text-base-content/40">
                            點擊新增按鈕來建立您的第一個錢包
                        </div>
                    </div>
                ) : (
                    availableCategories.map((category) => (
                        <WalletSection
                            key={category}
                            title={categoryNames[category] || category}
                            wallets={groupedWallets[category]}
                            category={category}
                        />
                    ))
                )}
            </div>

            {/* 錢包詳細資訊 Modal */}
            <WalletDetailModal
                walletId={selectedWallet?.id}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
