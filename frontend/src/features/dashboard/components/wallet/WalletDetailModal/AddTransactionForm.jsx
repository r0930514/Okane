import PropTypes from "prop-types";
import { useState } from "react";
import { 
    CalendarIcon, 
    TagIcon, 
    CurrencyDollarIcon
} from "@phosphor-icons/react";
import { useTransactions } from '../../../hooks/useTransactions';
import { CATEGORY_ICONS } from '../../../constants/walletConstants.jsx';

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
    const [showCustomCategory, setShowCustomCategory] = useState(false);

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

    // 計算顯示金額
    const displayAmount = formData.amount ? parseFloat(formData.amount) : 0;
    const currentBalance = wallet?.balance || wallet?.currentBalance || 0;
    const newBalance = formData.amount ? currentBalance + (formData.type === 'income' ? displayAmount : -displayAmount) : currentBalance;

    return (
        <div className="h-full flex flex-col">
            {/* 餘額顯示 */}
            <div className="text-end mb-6">
                {formData.amount && displayAmount > 0 && (
                    <>
                        <div className={`text-lg font-medium ${
                            formData.type === 'income' ? 'text-success' : 'text-error'
                        }`}>
                            {formData.type === 'income' ? '+' : '-'}${displayAmount.toLocaleString()}
                        </div>
                        <div className="text-3xl font-bold">
                        ${newBalance.toLocaleString()}
                        </div>
                    </>
                )}
                {(!formData.amount || displayAmount === 0) && (
                    <div className="text-3xl font-bold">
                    ${currentBalance.toLocaleString()}
                    </div>
                )}
            </div>
      
            {/* Tab 內容 */}
            <div className="flex-1 overflow-y-auto px-2" role="tabpanel">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1  pr-2">
                        {/* 交易類型選擇 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">交易類型</legend>
                            <div role="tablist" className="tabs tabs-box">
                                {TRANSACTION_TYPES.map(type => (
                                    <input
                                        key={type.value}
                                        type="radio"
                                        name="transaction-type"
                                        className="tab"
                                        aria-label={type.label}
                                        checked={formData.type === type.value}
                                        onChange={() => handleTypeChange(type.value)}
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                            <p className="label">請選擇交易類型</p>
                        </fieldset>

                        {/* 金額 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">金額</legend>
                            <label className="input validator w-full">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    disabled={loading}
                                />
                            </label>
                            <p className="label">請輸入交易金額</p>
                        </fieldset>

                        {/* 分類 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">分類</legend>
                            
                            {/* 快速分類按鈕 */}
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                    {currentCategories.map(category => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`btn btn-sm ${
                                                formData.category === category 
                                                    ? 'btn-neutral' 
                                                    : 'btn'
                                            }`}
                                            onClick={() => {
                                                handleInputChange('category', category);
                                                setShowCustomCategory(false);
                                            }}
                                            disabled={loading}
                                        >
                                            <span className="mr-1">
                                                {CATEGORY_ICONS[formData.type]?.[category]}
                                            </span>
                                            {category}
                                        </button>
                                    ))}
                                    
                                    {/* 自訂分類按鈕 */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${
                                            showCustomCategory 
                                                ? 'btn-neutral' 
                                                : 'btn'
                                        }`}
                                        onClick={() => {
                                            setShowCustomCategory(!showCustomCategory);
                                            if (!showCustomCategory) {
                                                setFormData(prev => ({ ...prev, category: '' }));
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        <TagIcon size={16} className="mr-1" />
                                        自訂分類
                                    </button>
                                </div>
                            </div>

                            {!showCustomCategory && (
                                <select
                                    className="select select-md w-full mb-2"
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
                            )}
                            
                            {showCustomCategory && (
                                <label className="input validator w-full">
                                    <TagIcon className="h-5 w-5 text-gray-500" />
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="請輸入自訂分類"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                            )}
                            <p className="label">請選擇或輸入交易分類</p>
                        </fieldset>

                        {/* 交易描述 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">交易描述</legend>
                            <label className="textarea validator w-full">
                                <textarea
                                    className="grow w-full"
                                    placeholder="請輸入交易的詳細描述"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    disabled={loading}
                                    rows={3}
                                />
                            </label>
                            <p className="label">請詳細描述此筆交易</p>
                        </fieldset>

                        {/* 交易日期 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">交易日期</legend>
                            <label className="input validator w-full">
                                <CalendarIcon className="h-5 w-5 text-gray-500" />
                                <input
                                    type="date"
                                    className="grow"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    disabled={loading}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </label>
                            <p className="label">請選擇交易發生的日期</p>
                        </fieldset>

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

               
                </form>
                
        
                
            </div>
        
            {/* 完成按鈕 */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    className="btn"
                    onClick={onCancel}
                    disabled={loading}
                >
                        取消
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit}
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
        </div>
    );
}

AddTransactionForm.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number,
        balance: PropTypes.number,
        currentBalance: PropTypes.number
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};
