'use client';

import { CaretRight, Plus } from "@phosphor-icons/react";
import { useMemo, useState, useEffect } from "react";
import WalletListCard from "./WalletListCard";
import { useWallets } from "@/app/dashboard/hooks/useWallets";
import type { Wallet } from "@/lib/types";

export default function WalletList() {
    const { wallets, loading, error, refetch } = useWallets();

    // Modal 狀態管理（暫時移除，等 WalletDetailModal 實作完成）
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    
    // 主貨幣狀態（簡化版，不使用 UserService）
    const [primaryCurrency, setPrimaryCurrency] = useState('TWD');

    // 分類類型對應的中文名稱
    const categoryNames: Record<string, string> = {
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
        const groups: Record<string, Wallet[]> = {};

        wallets.forEach((wallet) => {
            // 使用錢包類型或預設為 manual，需要將 WalletType enum 轉換為 string
            const walletType = wallet.type?.toString() || "manual";

            if (!groups[walletType]) {
                groups[walletType] = [];
            }

            groups[walletType].push(wallet);
        });

        return groups;
    }, [wallets]);

    // 取得有錢包的分類列表
    const availableCategories = Object.keys(groupedWallets);

    const handleWalletClick = (wallet: Wallet) => {
        setSelectedWallet(wallet);
        // 暫時移除 modal 功能，等實作完成後再加入
        console.log('錢包點擊:', wallet);
    };

    const handleAddWallet = (category: string) => {
        // 這裡之後可以打開新增錢包的模態框
        console.log('新增錢包，分類:', category);
    };

    if (loading) {
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

    interface WalletSectionProps {
        title: string;
        wallets: Wallet[];
        category: string;
    }

    const WalletSection = ({ title, wallets, category }: WalletSectionProps) => (
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
                        name={wallet.name}
                        balance={wallet.balance || 0}
                        color={wallet.color || "#10b981"}
                        onClick={() => handleWalletClick(wallet)}
                        currency={wallet.currency || 'TWD'}
                        primaryCurrency={primaryCurrency}
                        convertedBalance={wallet.balance} // 簡化版，暫時不進行貨幣轉換
                    />
                ))}
            </div>
        </div>
    );

    return (
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
    );
}