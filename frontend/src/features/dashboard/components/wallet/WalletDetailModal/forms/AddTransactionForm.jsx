import PropTypes from "prop-types";
import { useState } from "react";
import { CalendarIcon } from "@phosphor-icons/react";
import { useTransactions } from "../../../../hooks/useTransactions";
import CategorySelector from "../shared/CategorySelector";
import AmountInput from "../shared/AmountInput";
import TransactionPreview from "../shared/TransactionPreview";
import useTransactionFormValidation from "../../../../hooks/useTransactionFormValidation";
import {
    DEFAULT_CATEGORIES,
    CURRENCY_OPTIONS,
} from "../../../../constants/walletConstants";

// 交易類型選項
const TRANSACTION_TYPES = [
    { value: "income", label: "收入", color: "text-success" },
    { value: "expense", label: "支出", color: "text-error" },
];

export default function AddTransactionForm({ wallet, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        type: "expense",
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        currency: wallet?.currency || "TWD",
        exchangeRate: 1,
        exchangeRateSource: "manual",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const { createTransaction } = useTransactions(wallet?.id);
    const { validate } = useTransactionFormValidation({
        requireDescription: false,
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError("");
    };

    const handleTypeChange = (type) => {
        setFormData((prev) => ({ ...prev, type, category: "" }));
        setShowCustomCategory(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { valid, error: validationError } = validate(formData);
        if (!valid) {
            setError(validationError);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const transactionData = {
                amount: parseFloat(formData.amount),
                type: formData.type,
                description:
                    formData.description.trim() || formData.category.trim(),
                category: formData.category.trim(),
                date: formData.date,
                currency: formData.currency,
                exchangeRate: parseFloat(formData.exchangeRate),
                exchangeRateSource: formData.exchangeRateSource.trim(),
            };
            const result = await createTransaction(transactionData);
            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || "新增交易失敗");
            }
        } catch (err) {
            setError("系統錯誤，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    const currentCategories = DEFAULT_CATEGORIES[formData.type];
    const displayAmount = formData.amount ? parseFloat(formData.amount) : 0;
    const currentBalance = wallet?.balance || wallet?.currentBalance || 0;
    const newBalance = formData.amount
        ? currentBalance +
          (formData.type === "income" ? displayAmount : -displayAmount)
        : currentBalance;

    return (
        <div className="h-full flex flex-col">
            {/* 餘額顯示 */}
            <div className="text-end mb-6">
                {formData.amount && displayAmount > 0 ? (
                    <>
                        <div
                            className={`text-lg font-medium ${formData.type === "income" ? "text-success" : "text-error"}`}
                        >
                            {formData.type === "income" ? "+" : "-"}$
                            {displayAmount.toLocaleString()}
                        </div>
                        <div className="text-3xl font-bold">
                            ${newBalance.toLocaleString()}
                        </div>
                    </>
                ) : (
                    <div className="text-3xl font-bold">
                        ${currentBalance.toLocaleString()}
                    </div>
                )}
            </div>
            {/* Tab 內容 */}
            <div className="flex-1 overflow-y-auto px-2" role="tabpanel">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1 pr-2">
                        {/* 交易類型選擇 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                交易類型
                            </legend>
                            <div role="tablist" className="tabs tabs-box">
                                {TRANSACTION_TYPES.map((type) => (
                                    <input
                                        key={type.value}
                                        type="radio"
                                        name="transaction-type"
                                        className="tab"
                                        aria-label={type.label}
                                        checked={formData.type === type.value}
                                        onChange={() =>
                                            handleTypeChange(type.value)
                                        }
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                            <p className="label">請選擇交易類型</p>
                        </fieldset>
                        {/* 金額 */}
                        <AmountInput
                            value={formData.amount}
                            onChange={(val) => handleInputChange("amount", val)}
                            loading={loading}
                        />
                        {/* 分類 */}
                        <CategorySelector
                            categories={currentCategories}
                            value={formData.category}
                            showCustomCategory={showCustomCategory}
                            onCategoryChange={(val) =>
                                handleInputChange("category", val)
                            }
                            onCustomToggle={setShowCustomCategory}
                            loading={loading}
                            type={formData.type}
                        />
                        {/* 交易描述 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                交易描述
                            </legend>
                            <label className="textarea w-full">
                                <textarea
                                    className="grow w-full"
                                    placeholder="請輸入交易的詳細描述"
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    disabled={loading}
                                    rows={3}
                                />
                            </label>
                            <p className="label">請詳細描述此筆交易</p>
                        </fieldset>
                        {/* 交易日期 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                交易日期
                            </legend>
                            <label className="input validator w-full">
                                <CalendarIcon className="h-5 w-5 text-gray-500" />
                                <input
                                    type="date"
                                    className="grow"
                                    value={formData.date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "date",
                                            e.target.value,
                                        )
                                    }
                                    disabled={loading}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </label>
                            <p className="label">請選擇交易發生的日期</p>
                        </fieldset>
                        {/* 幣別與匯率 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                幣別與匯率
                            </legend>
                            <div className="flex gap-2 items-center">
                                <select
                                    className="select select-bordered"
                                    value={formData.currency}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "currency",
                                            e.target.value,
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {CURRENCY_OPTIONS.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    className="input input-bordered w-32"
                                    step="0.000001"
                                    min="0"
                                    placeholder="匯率"
                                    value={formData.exchangeRate}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "exchangeRate",
                                            e.target.value,
                                        )
                                    }
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="input input-bordered w-32"
                                    placeholder="來源 (如 manual, yahoo)"
                                    value={formData.exchangeRateSource}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "exchangeRateSource",
                                            e.target.value,
                                        )
                                    }
                                    disabled={loading}
                                />
                            </div>
                            <p className="label">選擇幣別、填寫匯率與來源</p>
                        </fieldset>
                        {/* 預覽 */}
                        <TransactionPreview
                            type={formData.type}
                            amount={formData.amount}
                            category={formData.category}
                            date={formData.date}
                            description={formData.description}
                            currency={formData.currency}
                            walletCurrency={wallet?.currency || "TWD"}
                            exchangeRate={formData.exchangeRate}
                            exchangeRateSource={formData.exchangeRateSource}
                            amountInWalletCurrency={
                                formData.amount && formData.exchangeRate
                                    ? parseFloat(formData.amount) *
                                      parseFloat(formData.exchangeRate)
                                    : ""
                            }
                        />
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
                    disabled={
                        loading || !formData.amount || !formData.category.trim()
                    }
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            新增中...
                        </>
                    ) : (
                        "確認新增"
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
        currentBalance: PropTypes.number,
        currency: PropTypes.string,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};
