import PropTypes from "prop-types";
import { useState } from "react";
import { CalendarIcon, TagIcon, FileTextIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
import { useTransactions } from '../../../hooks/useTransactions';

// 交易類型選項
const TRANSACTION_TYPES = [
    { value: 'income', label: '收入', color: 'text-success' },
    { value: 'expense', label: '支出', color: 'text-error' }
];

// 預設分類
const DEFAULT_CATEGORIES = {
    income: ['薪水', '獎金', '投資收益', '副業收入', '其他收入'],
    expense: ['餐飲', '交通', '購物', '娛樂', '醫療', '教育', '居住', '其他支出']
};

export default function AddTransactionForm({ wallet, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { createTransaction } = useTransactions(wallet?.id);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError('');
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            type: type,
            category: '' // 重置分類選擇
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 表單驗證
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('請輸入有效的金額');
            return;
        }

        if (!formData.description.trim()) {
            setError('請輸入交易描述');
            return;
        }

        if (!formData.category.trim()) {
            setError('請選擇或輸入分類');
            return;
        }

        if (!formData.date) {
            setError('請選擇交易日期');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const transactionData = {
                amount: parseFloat(formData.amount),
                type: formData.type,
                description: formData.description.trim(),
                category: formData.category.trim(),
                date: formData.date
            };

            const result = await createTransaction(transactionData);
            
            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || '新增交易失敗');
            }
        } catch (err) {
            setError('系統錯誤，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // 只允許正數和小數點
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            handleInputChange('amount', value);
        }
    };

    const currentCategories = DEFAULT_CATEGORIES[formData.type];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">新增交易記錄</h3>
                <p className="text-base-content/60">記錄一筆新的收入或支出</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                    {/* 交易類型選擇 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label">交易類型</span>
                        </label>
                        <div className="flex gap-2">
                            {TRANSACTION_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    className={`btn flex-1 ${
                                        formData.type === type.value 
                                            ? 'btn-primary' 
                                            : 'btn-outline'
                                    }`}
                                    onClick={() => handleTypeChange(type.value)}
                                    disabled={loading}
                                >
                                    <span className={type.color}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 金額 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label flex items-center gap-2">
                                <CurrencyDollarIcon size={16} />
                                金額
                            </span>
                        </label>
                        <input
                            type="text"
                            className="input input-md"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleAmountChange}
                            disabled={loading}
                        />
                    </div>

                    {/* 分類 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label flex items-center gap-2">
                                <TagIcon size={16} />
                                分類
                            </span>
                        </label>
                        <select
                            className="select select-md"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            disabled={loading}
                        >
                            <option value="">選擇分類</option>
                            {currentCategories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="input input-md mt-2"
                            placeholder="或輸入自訂分類"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 交易描述 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label flex items-center gap-2">
                                <FileTextIcon size={16} />
                                交易描述
                            </span>
                        </label>
                        <textarea
                            className="textarea textarea-md"
                            placeholder="請輸入交易的詳細描述"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    {/* 交易日期 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label flex items-center gap-2">
                                <CalendarIcon size={16} />
                                交易日期
                            </span>
                        </label>
                        <input
                            type="date"
                            className="input input-md"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            disabled={loading}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* 預覽 */}
                    {formData.amount && formData.description && (
                        <div className="card card-border p-4">
                            <h4 className="font-medium mb-2">交易預覽</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>類型：</span>
                                    <span className={
                                        formData.type === 'income' 
                                            ? 'text-success' 
                                            : 'text-error'
                                    }>
                                        {formData.type === 'income' ? '收入' : '支出'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>金額：</span>
                                    <span className={
                                        formData.type === 'income' 
                                            ? 'text-success font-semibold' 
                                            : 'text-error font-semibold'
                                    }>
                                        {formData.type === 'income' ? '+' : '-'}
                                        ${parseFloat(formData.amount || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>分類：</span>
                                    <span>{formData.category || '未分類'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>日期：</span>
                                    <span>{formData.date}</span>
                                </div>
                            </div>
                        </div>
                    )}

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
                        disabled={loading || !formData.amount || !formData.description.trim() || !formData.category.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                新增中...
                            </>
                        ) : (
                            '確認新增'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

AddTransactionForm.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};
