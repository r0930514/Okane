import PropTypes from "prop-types";
import { useState } from "react";
import { TrashIcon, XCircleIcon } from "@phosphor-icons/react";
import { useTransactions } from '../../../hooks/useTransactions';
import { formatCurrency, formatDate, getTransactionType, getTransactionDate, getTransactionDescription } from '../../../../../shared/utils/formatUtils';

export default function DeleteConfirmModal({ 
    isOpen, 
    onClose, 
    transaction, 
    wallet, 
    onSuccess 
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { deleteTransaction } = useTransactions(wallet?.id);

    const handleDelete = async () => {
        if (!transaction?.id) {
            setError('交易記錄無效');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await deleteTransaction(transaction.id);
            
            if (result.success) {
                onSuccess?.();
                onClose();
            } else {
                setError(result.error || '刪除交易失敗');
            }
        } catch (err) {
            setError('系統錯誤，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !transaction) return null;

    const transactionType = getTransactionType(transaction);
    const transactionDate = getTransactionDate(transaction);
    const transactionAmount = transaction.amount || 0;
    const category = transaction.category;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <TrashIcon className="h-5 w-5 text-error" />
                        刪除交易
                    </h3>
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* 確認訊息 */}
                <div className="mb-6">
                    <p className="text-base mb-4">
                        確定要刪除這筆交易記錄嗎？此操作無法復原。
                    </p>

                    {/* 交易詳情預覽 */}
                    <div className="card card-border p-4 bg-base-50">
                        <h4 className="font-medium mb-3">交易詳情</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-base-content/70">描述：</span>
                                <span className="font-medium">
                                    {getTransactionDescription(transaction)}
                                </span>
                            </div>
                            
                            {category && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-base-content/70">分類：</span>
                                    <div className="badge badge-ghost badge-sm">
                                        {category}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-base-content/70">日期：</span>
                                <span>{formatDate(transactionDate)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-base-content/70">金額：</span>
                                <span className={`font-semibold ${
                                    transactionType === 'income' ? 'text-success' : 'text-error'
                                }`}>
                                    {transactionType === 'income' ? '+' : '-'}
                                    {formatCurrency(Math.abs(parseFloat(transactionAmount) || 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 錯誤訊息 */}
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                {/* 操作按鈕 */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        className="btn btn-error"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                刪除中...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="h-4 w-4" />
                                確認刪除
                            </>
                        )}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}

DeleteConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transaction: PropTypes.object,
    wallet: PropTypes.shape({
        id: PropTypes.number
    }),
    onSuccess: PropTypes.func
};
