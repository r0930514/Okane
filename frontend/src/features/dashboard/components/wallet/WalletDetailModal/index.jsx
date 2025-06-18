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
            <div className="modal-box w-full h-full max-w-none mt-4  lg:w-11/12 lg:max-w-5xl lg:h-4/5 lg:max-h-screen m-0 lg:m-auto rounded-t-4xl lg:rounded-2xl">

                {/* 主要內容區域 - 響應式佈局，小螢幕全螢幕，大螢幕保持適當間距 */}
                <div className="flex flex-col lg:flex-row h-full">
                    {/* 錢包 Header - 小裝置上置頂，大裝置左側 */}
                    <div className="w-full lg:w-1/4 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-base-200">
                        <WalletHeader 
                            wallet={wallet} 
                            onUpdateBalance={handleUpdateBalance}
                            onAddTransaction={handleAddTransaction}
                        />
                    </div>

                    {/* 主要內容 - 根據視圖模式顯示不同內容 */}
                    <div className="flex-1 p-4 lg:p-6 pb-4 flex flex-col min-h-0">
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
                                {/* 餘額顯示 - 響應式字體大小 */}
                                <div className="text-center lg:text-end mb-4 lg:mb-6">
                                    <div className="text-2xl lg:text-3xl font-bold">
                                        {formatCurrency(wallet.balance || wallet.currentBalance)}
                                    </div>
                                </div>

                                {/* Tab 導航 - 響應式大小 */}
                                <div className="tabs tabs-lift mb-4 w-full" role="tablist">
                                    <button 
                                        className={`tab tab-md lg:tab-lg w-1/2 ${activeTab === TAB_TYPES.TRANSACTIONS ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange(TAB_TYPES.TRANSACTIONS)}
                                        role="tab"
                                        aria-selected={activeTab === TAB_TYPES.TRANSACTIONS}
                                    >
                                        <span className="hidden sm:inline">交易明細</span>
                                        <span className="sm:hidden">明細</span>
                                    </button>
                                    <button 
                                        className={`tab tab-md lg:tab-lg w-1/2 ${activeTab === TAB_TYPES.SETTINGS ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange(TAB_TYPES.SETTINGS)}
                                        role="tab"
                                        aria-selected={activeTab === TAB_TYPES.SETTINGS}
                                    >
                                        <span className="hidden sm:inline">錢包設定</span>
                                        <span className="sm:hidden">設定</span>
                                    </button>
                                </div>

                                {/* Tab 內容 - 確保可滾動 */}
                                <div className="flex-1 overflow-y-auto min-h-0" role="tabpanel">
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

                                {/* 完成按鈕 - 響應式設計 */}
                                <div className="flex justify-center lg:justify-end mt-4">
                                    <button className="btn btn-md w-full sm:w-auto max-w-xs" onClick={handleClose}>
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
