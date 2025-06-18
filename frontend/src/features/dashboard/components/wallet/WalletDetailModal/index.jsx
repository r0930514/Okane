import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import { useTransactions } from '../../../hooks/useTransactions';
import { useWalletStats } from '../../../hooks/useWalletStats';
import { formatCurrency } from '../../../../../shared/utils/formatUtils';
import { TAB_TYPES, VIEW_MODES } from '../../../constants/walletConstants';
import WalletHeader from './WalletHeader';
import TransactionsTab from './TransactionsTab';
import SettingsTab from './SettingsTab';
import UpdateBalanceForm from './UpdateBalanceForm';
import AddTransactionForm from './AddTransactionForm';

export default function WalletDetailModal({ wallet, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState(TAB_TYPES.TRANSACTIONS);
    const [viewMode, setViewMode] = useState(VIEW_MODES.DEFAULT);
    
    // 使用 useTransactions hook 取得該錢包的交易明細
    const { 
        transactions, 
        loading: transactionsLoading, 
        error: transactionsError,
        refetch
    } = useTransactions(wallet?.id);

    // 使用自定義 hook 計算錢包統計資訊
    const walletStats = useWalletStats(wallet, transactions);

    // 使用 useCallback 避免不必要的重新渲染
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        setViewMode(VIEW_MODES.DEFAULT); // 重置視圖模式
    }, []);

    const handleClose = useCallback(() => {
        setActiveTab(TAB_TYPES.TRANSACTIONS); // 重置到預設 tab
        setViewMode(VIEW_MODES.DEFAULT); // 重置視圖模式
        onClose();
    }, [onClose]);

    // 按鈕點擊處理函數
    const handleUpdateBalance = useCallback(() => {
        setViewMode(VIEW_MODES.UPDATE_BALANCE);
    }, []);

    const handleAddTransaction = useCallback(() => {
        setViewMode(VIEW_MODES.ADD_TRANSACTION);
    }, []);

    const handleFormCancel = useCallback(() => {
        setViewMode(VIEW_MODES.DEFAULT);
    }, []);

    const handleFormSuccess = useCallback(() => {
        setViewMode(VIEW_MODES.DEFAULT);
        refetch(); // 重新載入交易資料
    }, [refetch]);

    if (!isOpen || !wallet) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-4/5">

                {/* 主要內容區域 - 左右分割 */}
                <div className="flex h-full">
                    {/* 左半部 - 錢包類型和名稱 */}
                    <WalletHeader 
                        wallet={wallet} 
                        onUpdateBalance={handleUpdateBalance}
                        onAddTransaction={handleAddTransaction}
                    />

                    {/* 右半部 - 根據視圖模式顯示不同內容 */}
                    <div className="w-3/4 p-6 pb-4 flex flex-col">
                        {viewMode === VIEW_MODES.UPDATE_BALANCE ? (
                            <UpdateBalanceForm
                                wallet={wallet}
                                onCancel={handleFormCancel}
                                onSuccess={handleFormSuccess}
                            />
                        ) : viewMode === VIEW_MODES.ADD_TRANSACTION ? (
                            <AddTransactionForm
                                wallet={wallet}
                                onCancel={handleFormCancel}
                                onSuccess={handleFormSuccess}
                            />
                        ) : (
                            <>
                                {/* 餘額顯示 */}
                                <div className="text-end mb-6">
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(wallet.balance || wallet.currentBalance)}
                                    </div>
                                </div>

                                {/* Tab 導航 */}
                                <div className="tabs tabs-lift mb-4 w-full" role="tablist">
                                    <button 
                                        className={`tab tab-lg w-1/2 ${activeTab === TAB_TYPES.TRANSACTIONS ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange(TAB_TYPES.TRANSACTIONS)}
                                        role="tab"
                                        aria-selected={activeTab === TAB_TYPES.TRANSACTIONS}
                                    >
                                        交易明細
                                    </button>
                                    <button 
                                        className={`tab tab-lg w-1/2 ${activeTab === TAB_TYPES.SETTINGS ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange(TAB_TYPES.SETTINGS)}
                                        role="tab"
                                        aria-selected={activeTab === TAB_TYPES.SETTINGS}
                                    >
                                        錢包設定
                                    </button>
                                </div>

                                {/* Tab 內容 */}
                                <div className="flex-1 overflow-y-auto" role="tabpanel">
                                    {activeTab === TAB_TYPES.TRANSACTIONS && (
                                        <TransactionsTab 
                                            walletStats={walletStats}
                                            transactionsLoading={transactionsLoading}
                                            transactionsError={transactionsError}
                                        />
                                    )}

                                    {activeTab === TAB_TYPES.SETTINGS && (
                                        <SettingsTab wallet={wallet} />
                                    )}
                                </div>

                                {/* 完成按鈕 */}
                                <div className="flex justify-end">
                                    <button className="btn mt-4 w-fit" onClick={handleClose}>
                                        完成
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose} aria-label="關閉錢包詳細資訊">close</button>
            </form>
        </dialog>
    );
}

WalletDetailModal.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number,
        walletName: PropTypes.string,
        walletType: PropTypes.string,
        balance: PropTypes.number,
        currentBalance: PropTypes.number,
        walletColor: PropTypes.string,
        description: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
