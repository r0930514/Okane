import PropTypes from "prop-types";
import { useState } from "react";
import { useTransactions } from '../../../hooks/useTransactions';

export default function UpdateBalanceForm({ wallet, onCancel, onSuccess }) {
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { createTransaction } = useTransactions(wallet?.id);

    const currentBalance = wallet?.balance || wallet?.currentBalance || 0;
    const newBalance = adjustmentAmount ? currentBalance + parseFloat(adjustmentAmount) : currentBalance;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!adjustmentAmount || parseFloat(adjustmentAmount) === 0) {
            setError('請輸入調整金額');
            return;
        }

        if (!description.trim()) {
            setError('請輸入調整說明');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const transactionData = {
                amount: parseFloat(adjustmentAmount),
                type: parseFloat(adjustmentAmount) > 0 ? 'income' : 'expense',
                description: description.trim(),
                category: '餘額調整',
                date: new Date().toISOString().split('T')[0]
            };

            const result = await createTransaction(transactionData);
            
            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || '更新失敗');
            }
        } catch (err) {
            setError('系統錯誤，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // 允許負數和小數點
        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setAdjustmentAmount(value);
            setError('');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">更新餘額</h3>
                <p className="text-base-content/60">透過新增調整分錄來更新錢包餘額</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                    {/* 當前餘額顯示 */}
                    <div className="card card-border p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-base-content/60">當前餘額</span>
                            <span className="text-lg font-semibold">
                                ${currentBalance.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base-content/60">調整後餘額</span>
                            <span className={`text-lg font-semibold ${
                                newBalance >= 0 ? 'text-success' : 'text-error'
                            }`}>
                                ${newBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* 調整金額 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label">調整金額</span>
                        </label>
                        <input
                            type="text"
                            className="input input-md"
                            placeholder="輸入正數增加餘額，負數減少餘額"
                            value={adjustmentAmount}
                            onChange={handleAmountChange}
                            disabled={loading}
                        />
                        <p className="label text-xs text-base-content/60 mt-1">
                            例如：+1000 表示增加 $1,000，-500 表示減少 $500
                        </p>
                    </div>

                    {/* 調整說明 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label">調整說明</span>
                        </label>
                        <textarea
                            className="textarea textarea-md"
                            placeholder="請說明此次餘額調整的原因"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    {/* 錯誤訊息 */}
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* 按鈕區域 */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !adjustmentAmount || !description.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                處理中...
                            </>
                        ) : (
                            '確認更新'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

UpdateBalanceForm.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number,
        balance: PropTypes.number,
        currentBalance: PropTypes.number
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};
