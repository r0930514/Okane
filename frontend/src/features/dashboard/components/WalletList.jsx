import { CaretRight, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import PropTypes from "prop-types";
import WalletListCard from "./WalletListCard";

export default function WalletList() {
    // 模擬錢包數據
    const [walletData] = useState({
        manual: [
            { id: 1, name: "現金", balance: 12400, color: "#10b981" },
            { id: 2, name: "中國信託", balance: 45600, color: "#3b82f6" },
            { id: 3, name: "投資帳戶", balance: 78900, color: "#8b5cf6" },
        ],
        sync: [
            { id: 4, name: "台新銀行", balance: 23400, color: "#06b6d4" },
            { id: 5, name: "國泰世華", balance: 56700, color: "#f59e0b" },
        ],
        crypto: [
            { id: 6, name: "Bitcoin", balance: 89000, color: "#f97316" },
            { id: 7, name: "Ethereum", balance: 34500, color: "#6366f1" },
        ]
    });

    const handleWalletClick = (wallet) => {
        console.log(`點擊錢包: ${wallet.name}, 餘額: $${wallet.balance}`);
        // 這裡之後可以導航到錢包詳細頁面
    };

    const handleAddWallet = (category) => {
        console.log(`新增 ${category} 錢包`);
        // 這裡之後可以打開新增錢包的模態框
    };

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
                        name={wallet.name}
                        balance={wallet.balance}
                        color={wallet.color}
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
            name: PropTypes.string.isRequired,
            balance: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired,
        })).isRequired,
        category: PropTypes.string.isRequired,
    };

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto px-6 py-3 gap-6">
            <WalletSection title="手動帳戶" wallets={walletData.manual} category="manual" />
            <WalletSection title="同步帳戶" wallets={walletData.sync} category="sync" />
            <WalletSection title="加密貨幣" wallets={walletData.crypto} category="crypto" />
        </div>
    )
}
