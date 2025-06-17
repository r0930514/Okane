import { 
    XIcon, 
    WalletIcon, 
    TrendUpIcon, 
    TrendDownIcon, 
    CalendarIcon,
    CreditCardIcon,
    BankIcon,
    CoinsIcon,
    CurrencyDollarIcon,
    CoinIcon,
    GearIcon
} from "@phosphor-icons/react";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTransactions } from '../../hooks/useTransactions';

export default function WalletDetailModal({ wallet, isOpen, onClose }) {
    // Tab 狀態管理
    const [activeTab, setActiveTab] = useState('transactions');
    
    // 使用 useTransactions hook 取得該錢包的交易明細
    const { 
        transactions, 
        loading: transactionsLoading, 
        error: transactionsError 
    } = useTransactions(wallet?.id);

    // 根據錢包類型選擇圖標
    const getWalletIcon = (walletType) => {
        const iconMap = {
            manual: WalletIcon,
            bank: BankIcon,
            credit: CreditCardIcon,
            crypto: CoinsIcon,
            investment: TrendUpIcon,
            savings: CoinIcon,
            cash: CurrencyDollarIcon,
            sync: WalletIcon
        };
        return iconMap[walletType] || WalletIcon;
    };

    // 取得錢包類型的中文名稱
    const getWalletTypeName = (walletType) => {
        const typeMap = {
            manual: '手動帳戶',
            sync: '同步帳戶',
            crypto: '加密貨幣',
            bank: '銀行帳戶',
            credit: '信用卡',
            investment: '投資帳戶',
            savings: '儲蓄帳戶',
            cash: '現金帳戶'
        };
        return typeMap[walletType] || walletType;
    };

    // 格式化貨幣
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // 格式化日期
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // 計算錢包統計資訊
    const walletStats = useMemo(() => {
        if (!wallet || !transactions || !Array.isArray(transactions)) {
            return {
                income: 0,
                expense: 0,
                allTransactions: [],
                transactionCount: 0
            };
        }

        // 安全地解析金額，確保是數字
        const parseAmount = (amount) => {
            if (typeof amount === 'number') return amount;
            if (typeof amount === 'string') {
                const parsed = parseFloat(amount);
                return isNaN(parsed) ? 0 : parsed;
            }
            return 0;
        };

        const income = transactions
            .filter(t => t.type === 'income' || t.transactionType === 'income')
            .reduce((sum, t) => sum + parseAmount(t.amount), 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense' || t.transactionType === 'expense')
            .reduce((sum, t) => sum + parseAmount(t.amount), 0);

        const allTransactions = [...transactions]
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || a.transactionDate);
                const dateB = new Date(b.createdAt || b.date || b.transactionDate);
                return dateB - dateA;
            });

        return {
            income,
            expense,
            allTransactions,
            transactionCount: transactions.length
        };
    }, [wallet, transactions]);

    if (!isOpen || !wallet) return null;

    const SelectedWalletIcon = getWalletIcon(wallet.walletType);

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-4/5">
                {/* 關閉按鈕 */}
                <button 
                    className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4 z-10"
                    onClick={onClose}
                >
                    <XIcon size={20} />
                </button>

                {/* 主要內容區域 - 左右分割 */}
                <div className="flex h-full">
                    {/* 左半部 - 錢包類型和名稱 */}
                    <div className="w-1/3 p-6 bg-base-200 rounded-l-lg flex flex-col items-center justify-center">
                        <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: wallet.walletColor || '#10b981' }}
                        >
                            <SelectedWalletIcon size={40} className="text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">{wallet.walletName}</h3>
                            <p className="text-base-content/60 text-lg">
                                {getWalletTypeName(wallet.walletType)}
                            </p>
                        </div>
                    </div>

                    {/* 右半部 - 餘額和 Tab */}
                    <div className="w-2/3 p-6 flex flex-col">
                        {/* 餘額顯示 */}
                        <div className="text-center mb-6">
                            <div className="text-sm text-base-content/60 mb-2">目前餘額</div>
                            <div className="text-4xl font-bold text-primary">
                                {formatCurrency(wallet.balance || wallet.currentBalance)}
                            </div>
                        </div>

                        {/* Tab 導航 */}
                        <div className="tabs tabs-box mb-4">
                            <button 
                                className={`tab tab-lg ${activeTab === 'transactions' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('transactions')}
                            >
                                交易明細
                            </button>
                            <button 
                                className={`tab tab-lg ${activeTab === 'settings' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                錢包設定
                            </button>
                        </div>

                        {/* Tab 內容 */}
                        <div className="flex-1 overflow-y-auto">
                            {activeTab === 'transactions' && (
                                <div className="space-y-4">
                                    {/* 統計摘要 */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="stat bg-base-200 rounded-lg p-4">
                                            <div className="stat-figure text-success">
                                                <TrendUpIcon size={24} />
                                            </div>
                                            <div className="stat-title text-xs">總收入</div>
                                            <div className="stat-value text-success text-lg">
                                                {formatCurrency(walletStats?.income || 0)}
                                            </div>
                                        </div>

                                        <div className="stat bg-base-200 rounded-lg p-4">
                                            <div className="stat-figure text-error">
                                                <TrendDownIcon size={24} />
                                            </div>
                                            <div className="stat-title text-xs">總支出</div>
                                            <div className="stat-value text-error text-lg">
                                                {formatCurrency(walletStats?.expense || 0)}
                                            </div>
                                        </div>

                                        <div className="stat bg-base-200 rounded-lg p-4">
                                            <div className="stat-figure text-info">
                                                <CalendarIcon size={24} />
                                            </div>
                                            <div className="stat-title text-xs">交易筆數</div>
                                            <div className="stat-value text-info text-lg">
                                                {walletStats?.transactionCount || 0}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 交易記錄列表 */}
                                    <div className="card bg-base-100 p-4">
                                        <h4 className="font-semibold mb-4">交易記錄</h4>
                                        {transactionsLoading ? (
                                            <div className="flex justify-center items-center py-8">
                                                <span className="loading loading-spinner loading-lg"></span>
                                            </div>
                                        ) : transactionsError ? (
                                            <div className="text-center py-8 text-error">
                                                載入交易記錄時發生錯誤：{transactionsError}
                                            </div>
                                        ) : walletStats && walletStats.allTransactions.length > 0 ? (
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {walletStats.allTransactions.map((transaction, index) => {
                                                    const transactionType = transaction.type || transaction.transactionType;
                                                    const transactionDate = transaction.createdAt || transaction.date || transaction.transactionDate;
                                                    const transactionAmount = transaction.amount || 0;
                                                    
                                                    return (
                                                        <div key={transaction.id || index} className="flex justify-between items-center py-3 border-b border-base-300 last:border-b-0">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {transaction.description || transaction.note || '無描述'}
                                                                </div>
                                                                <div className="text-sm text-base-content/60">
                                                                    {formatDate(transactionDate)}
                                                                </div>
                                                            </div>
                                                            <div className={`font-semibold text-lg ${
                                                                transactionType === 'income' ? 'text-success' : 'text-error'
                                                            }`}>
                                                                {transactionType === 'income' ? '+' : '-'}
                                                                {formatCurrency(Math.abs(parseFloat(transactionAmount) || 0))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-base-content/60">
                                                尚無交易記錄
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-4">
                                    {/* 錢包資訊 */}
                                    <div className="card bg-base-100 p-4">
                                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                                            <GearIcon size={20} />
                                            錢包資訊
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-base-content/60">錢包名稱：</span>
                                                <span className="font-medium">{wallet.walletName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-base-content/60">錢包類型：</span>
                                                <span className="font-medium">{getWalletTypeName(wallet.walletType)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-base-content/60">建立日期：</span>
                                                <span className="font-medium">{formatDate(wallet.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-base-content/60">最後更新：</span>
                                                <span className="font-medium">{formatDate(wallet.updatedAt)}</span>
                                            </div>
                                            {wallet.description && (
                                                <div className="flex justify-between">
                                                    <span className="text-base-content/60">描述：</span>
                                                    <span className="font-medium">{wallet.description}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 錢包設定選項 */}
                                    <div className="card bg-base-100 p-4">
                                        <h4 className="font-semibold mb-4">設定選項</h4>
                                        <div className="space-y-3">
                                            <button className="btn btn-outline w-full justify-start">
                                                編輯錢包資訊
                                            </button>
                                            <button className="btn btn-outline w-full justify-start">
                                                變更錢包顏色
                                            </button>
                                            <button className="btn btn-outline w-full justify-start">
                                                匯出交易記錄
                                            </button>
                                            <button className="btn btn-error btn-outline w-full justify-start">
                                                刪除錢包
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
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
        updatedAt: PropTypes.string,
        transactions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            amount: PropTypes.number,
            description: PropTypes.string,
            createdAt: PropTypes.string
        }))
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
