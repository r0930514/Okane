import { CaretRight, Plus } from "@phosphor-icons/react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import WalletListCard from "./WalletListCard";
import { useWallets } from '../../hooks/useWallets.js';

export default function WalletList() {
    const { wallets, loading, error } = useWallets();
    
    // 根據錢包類型分組
    const groupedWallets = useMemo(() => {
        const groups = {
            manual: [],
            sync: [],
            crypto: []
        };
        
        wallets.forEach(wallet => {
            // 根據 walletType 或其他屬性來分組
            if (wallet.walletType === 'manual') {
                groups.manual.push(wallet);
            } else if (wallet.walletType === 'sync') {
                groups.sync.push(wallet);
            } else {
                // 預設分到 manual 類別
                groups.manual.push(wallet);
            }
        });
        
        return groups;
    }, [wallets]);

    const handleWalletClick = (wallet) => {
        console.log(`點擊錢包: ${wallet.walletName}, 餘額: $${wallet.balance}`);
        // 這裡之後可以導航到錢包詳細頁面
    };

    const handleAddWallet = (category) => {
        console.log(`新增 ${category} 錢包`);
        // 這裡之後可以打開新增錢包的模態框
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

    const WalletSection = ({ title, wallets, category }) => (
        <div className="flex flex-col py-3 gap-3 w-full">
            <div className="flex items-center justify-between h-12">
                <div className="flex items-center gap-2">
                    <div className="text-start justify-start text-2xl font-semibold text-base-content">{title}</div>
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
            <div className="flex gap-4 overflow-x-auto pb-2">
                {wallets.map((wallet) => (
                    <WalletListCard
                        key={wallet.id}
                        name={wallet.walletName}
                        balance={wallet.balance || wallet.currentBalance || 0}
                        color={wallet.walletColor || "#10b981"}
                        onClick={() => handleWalletClick(wallet)}
                    />
                ))}
            </div>
        </div>
    );

    WalletSection.propTypes = {
        title: PropTypes.string.isRequired,
        wallets: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            walletName: PropTypes.string.isRequired,
            balance: PropTypes.number,
            walletColor: PropTypes.string.isRequired,
        })).isRequired,
        category: PropTypes.string.isRequired,
    };

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto px-6 py-3 gap-6">
            <WalletSection title="手動帳戶" wallets={groupedWallets.manual} category="manual" />
            <WalletSection title="同步帳戶" wallets={groupedWallets.sync} category="sync" />
            <WalletSection title="加密貨幣" wallets={groupedWallets.crypto} category="crypto" />
        </div>
    )
}
