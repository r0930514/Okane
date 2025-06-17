import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, X, Calendar, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { useTransactions } from '../hooks/useTransactions.js';
import { useWallets } from '../hooks/useWallets.js';
import DashboardLayout from '../components/DashboardLayout.jsx';

export default function TransactionManagement() {
    const [selectedWalletId, setSelectedWalletId] = useState(null);
    const { wallets } = useWallets();
    const { 
        transactions, 
        loading, 
        error, 
        createTransaction, 
        updateTransaction, 
        deleteTransaction,
        loadMore,
        pagination 
    } = useTransactions(selectedWalletId);
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({
        amount: 0,
        description: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    // 預設選擇第一個錢包
    useEffect(() => {
        if (wallets.length > 0 && !selectedWalletId) {
            setSelectedWalletId(wallets[0].id);
        }
    }, [wallets, selectedWalletId]);

    const selectedWallet = wallets.find(w => w.id === selectedWalletId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedWalletId) {
            alert('請選擇錢包');
            return;
        }

        try {
            let result;
            if (editingTransaction) {
                result = await updateTransaction(editingTransaction.id, formData);
            } else {
                result = await createTransaction(formData);
            }
            
            if (result.success) {
                setShowCreateModal(false);
                setEditingTransaction(null);
                resetForm();
            } else {
                alert(result.error || '操作失敗');
            }
        } catch (err) {
            alert('操作失敗，請稍後再試');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            amount: transaction.amount || 0,
            description: transaction.description || '',
            type: transaction.type || 'expense',
            category: transaction.category || '',
            date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowCreateModal(true);
    };

    const handleDelete = async (transaction) => {
        if (window.confirm(`確定要刪除這筆交易「${transaction.description}」嗎？`)) {
            const result = await deleteTransaction(transaction.id);
            if (!result.success) {
                alert(result.error || '刪除失敗');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            amount: 0,
            description: '',
            type: 'expense',
            category: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingTransaction(null);
        resetForm();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('zh-TW');
    };

    const TransactionCard = ({ transaction }) => (
        <div className="card bg-base-100 shadow-xs border">
            <div className="card-body p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                            transaction.type === 'income' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                        }`}>
                            {transaction.type === 'income' ? 
                                <ArrowUp size={20} /> : 
                                <ArrowDown size={20} />
                            }
                        </div>
                        <div>
                            <h4 className="font-semibold">{transaction.description}</h4>
                            <p className="text-sm text-gray-600">{transaction.category}</p>
                            <p className="text-xs text-gray-500">
                                <Calendar size={12} className="inline mr-1" />
                                {formatDate(transaction.date)}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-lg font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="flex gap-1 mt-2">
                            <button 
                                className="btn btn-xs btn-outline"
                                onClick={() => handleEdit(transaction)}
                            >
                                編輯
                            </button>
                            <button 
                                className="btn btn-xs btn-error btn-outline"
                                onClick={() => handleDelete(transaction)}
                            >
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    TransactionCard.propTypes = {
        transaction: PropTypes.object.isRequired
    };

    if (wallets.length === 0) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">尚未建立錢包</h2>
                        <p className="text-gray-500">請先建立錢包才能管理交易記錄</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">交易管理</h1>
                    <button 
                        className="btn btn-primary gap-2"
                        onClick={() => setShowCreateModal(true)}
                        disabled={!selectedWalletId}
                    >
                        <Plus size={20} />
                    新增交易
                    </button>
                </div>

                {/* 錢包選擇 */}
                <div className="mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">選擇錢包</span>
                    </label>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        value={selectedWalletId || ''}
                        onChange={(e) => setSelectedWalletId(parseInt(e.target.value))}
                    >
                        <option value="">請選擇錢包</option>
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.walletName} (${(wallet.balance || 0).toLocaleString()})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedWallet && (
                    <div className="alert alert-info mb-6">
                        <span>
                        目前選擇：{selectedWallet.walletName} - 餘額：${(selectedWallet.balance || 0).toLocaleString()}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                {loading && transactions.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map(transaction => (
                            <TransactionCard key={transaction.id} transaction={transaction} />
                        ))}
                    
                        {transactions.length === 0 && selectedWalletId && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">暫無交易記錄</h3>
                                <p className="text-gray-500">點擊上方按鈕開始新增交易</p>
                            </div>
                        )}

                        {pagination.hasMore && (
                            <div className="text-center mt-6">
                                <button 
                                    className="btn btn-outline"
                                    onClick={loadMore}
                                    disabled={loading}
                                >
                                    {loading ? '載入中...' : '載入更多'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 創建/編輯交易模態框 */}
                {showCreateModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">
                                    {editingTransaction ? '編輯交易' : '新增交易'}
                                </h3>
                                <button 
                                    className="btn btn-sm btn-circle btn-ghost"
                                    onClick={handleCloseModal}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">交易類型</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <label className="label cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                className="radio radio-primary" 
                                                value="income"
                                                checked={formData.type === 'income'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            />
                                            <span className="label-text ml-2">收入</span>
                                        </label>
                                        <label className="label cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                className="radio radio-primary" 
                                                value="expense"
                                                checked={formData.type === 'expense'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            />
                                            <span className="label-text ml-2">支出</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">金額</span>
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="input input-bordered w-full"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                        required
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">描述</span>
                                    </label>
                                    <input 
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">分類</span>
                                    </label>
                                    <input 
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="例：餐飲、交通、娛樂"
                                    />
                                </div>

                                <div className="form-control w-full mb-6">
                                    <label className="label">
                                        <span className="label-text">日期</span>
                                    </label>
                                    <input 
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn" onClick={handleCloseModal}>
                                    取消
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingTransaction ? '更新' : '創建'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
