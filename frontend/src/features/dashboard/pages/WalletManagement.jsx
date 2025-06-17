import { useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, X } from '@phosphor-icons/react';
import { useWallets } from '../hooks/useWallets.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

export default function WalletManagement() {
    const { wallets, loading, error, createWallet, updateWallet, deleteWallet } = useWallets();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [formData, setFormData] = useState({
        walletName: '',
        accountNumber: '',
        walletType: 'manual',
        walletColor: '#10b981',
        initialBalance: 0,
        operationMode: 'manual_only'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let result;
            if (editingWallet) {
                result = await updateWallet(editingWallet.id, formData);
            } else {
                result = await createWallet(formData);
            }
            
            if (result.success) {
                setShowCreateModal(false);
                setEditingWallet(null);
                resetForm();
            } else {
                alert(result.error || '操作失敗');
            }
        } catch (err) {
            alert('操作失敗，請稍後再試');
        }
    };

    const handleEdit = (wallet) => {
        setEditingWallet(wallet);
        setFormData({
            walletName: wallet.walletName || '',
            accountNumber: wallet.accountNumber || '',
            walletType: wallet.walletType || 'manual',
            walletColor: wallet.walletColor || '#10b981',
            initialBalance: wallet.balance || 0,
            operationMode: wallet.operationMode || 'manual_only'
        });
        setShowCreateModal(true);
    };

    const handleDelete = async (wallet) => {
        if (window.confirm(`確定要刪除錢包「${wallet.walletName}」嗎？`)) {
            const result = await deleteWallet(wallet.id);
            if (!result.success) {
                alert(result.error || '刪除失敗');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            walletName: '',
            accountNumber: '',
            walletType: 'manual',
            walletColor: '#10b981',
            initialBalance: 0,
            operationMode: 'manual_only'
        });
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingWallet(null);
        resetForm();
    };

    const WalletCard = ({ wallet }) => (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="card-title text-lg">{wallet.walletName}</h3>
                        <p className="text-sm text-gray-600">{wallet.accountNumber}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: wallet.walletColor }}
                            ></div>
                            <span className="text-sm capitalize">{wallet.walletType}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            ${(wallet.balance || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                            {wallet.operationMode}
                        </div>
                    </div>
                </div>
                <div className="card-actions justify-end mt-4">
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(wallet)}
                    >
                        編輯
                    </button>
                    <button 
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => handleDelete(wallet)}
                    >
                        刪除
                    </button>
                </div>
            </div>
        </div>
    );

    WalletCard.propTypes = {
        wallet: PropTypes.object.isRequired
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">錢包管理</h1>
                    <button 
                        className="btn btn-primary gap-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={20} />
                        新增錢包
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map(wallet => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                    ))}
                </div>

                {/* 創建/編輯錢包模態框 */}
                {showCreateModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">
                                    {editingWallet ? '編輯錢包' : '新增錢包'}
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
                                        <span className="label-text">錢包名稱</span>
                                    </label>
                                    <input 
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.walletName}
                                        onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">帳戶號碼</span>
                                    </label>
                                    <input 
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">錢包類型</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={formData.walletType}
                                        onChange={(e) => setFormData({ ...formData, walletType: e.target.value })}
                                    >
                                        <option value="manual">手動</option>
                                        <option value="sync">同步</option>
                                    </select>
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">錢包顏色</span>
                                    </label>
                                    <input 
                                        type="color"
                                        className="input input-bordered w-full h-12"
                                        value={formData.walletColor}
                                        onChange={(e) => setFormData({ ...formData, walletColor: e.target.value })}
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">初始餘額</span>
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        className="input input-bordered w-full"
                                        value={formData.initialBalance}
                                        onChange={(e) => setFormData({ ...formData, initialBalance: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="form-control w-full mb-6">
                                    <label className="label">
                                        <span className="label-text">操作模式</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={formData.operationMode}
                                        onChange={(e) => setFormData({ ...formData, operationMode: e.target.value })}
                                    >
                                        <option value="manual_only">僅手動</option>
                                        <option value="sync_only">僅同步</option>
                                        <option value="hybrid">混合模式</option>
                                    </select>
                                </div>

                                <div className="modal-action">
                                    <button type="button" className="btn" onClick={handleCloseModal}>
                                    取消
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingWallet ? '更新' : '創建'}
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
