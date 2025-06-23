import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { CalendarIcon, TrashIcon } from "@phosphor-icons/react";
import { useTransactions } from "../../../../hooks/useTransactions";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
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

export default function EditTransactionForm({
    wallet,
    transaction,
    onCancel,
    onSuccess,
}) {
    const currentBalance = wallet?.balance || wallet?.currentBalance || 0;
    const currentAmount = Math.abs(
        parseFloat(transaction.amount) || 0,
    ).toString();
    const [formData, setFormData] = useState({
        type: "expense",
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        currency: transaction?.currency || wallet?.currency || "TWD",
        exchangeRate: transaction?.exchangeRate || 1,
        exchangeRateSource: transaction?.exchangeRateSource || "manual",
    });
    const originalAmount =
        transaction.type === "income"
            ? parseFloat(transaction.amount)
            : -parseFloat(transaction.amount);
    const updatedAmount =
        formData.type === "income"
            ? parseFloat(formData.amount || 0)
            : -parseFloat(formData.amount || 0);
    const newBalance = currentBalance - originalAmount + updatedAmount;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { updateTransaction, deleteTransaction } = useTransactions(
        wallet?.id,
    );
    const { validate } = useTransactionFormValidation({
        requireDescription: true,
    });

    // 當 transaction 改變時，預填表單資料
    useEffect(() => {
        if (transaction) {
            const transactionDate =
                transaction.date ||
                transaction.created_at ||
                transaction.createdAt;
            const dateString = transactionDate
                ? new Date(transactionDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];

            setFormData({
                type: transaction.type || "expense",
                amount: Math.abs(
                    parseFloat(transaction.amount) || 0,
                ).toString(),
                description: transaction.description || "",
                category: transaction.category || "",
                date: dateString,
                currency: transaction.currency || wallet?.currency || "TWD",
                exchangeRate: transaction.exchangeRate || 1,
                exchangeRateSource: transaction.exchangeRateSource || "manual",
            });

            // 檢查是否使用自訂分類
            const currentCategories =
                DEFAULT_CATEGORIES[transaction.type || "expense"];
            const isCustomCategory = !currentCategories.includes(
                transaction.category || "",
            );
            setShowCustomCategory(isCustomCategory);
        }
    }, [transaction]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (error) setError("");
    };

    const handleTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            type,
            category: "", // 重置分類選擇
        }));
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
            const updateData = {
                amount: parseFloat(formData.amount),
                type: formData.type,
                description: formData.description.trim(),
                category: formData.category.trim(),
                date: formData.date,
                currency: formData.currency,
                exchangeRate: parseFloat(formData.exchangeRate),
                exchangeRateSource: formData.exchangeRateSource.trim(),
            };

            const result = await updateTransaction(transaction.id, updateData);

            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || "更新交易失敗");
            }
        } catch (err) {
            setError("系統錯誤，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await deleteTransaction(transaction.id);

            if (result.success) {
                setShowDeleteModal(false);
                onSuccess?.();
            } else {
                setError(result.error || "刪除交易失敗");
                setShowDeleteModal(false);
            }
            onSuccess?.();
        } catch (err) {
            setError("系統錯誤，請稍後再試");
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const currentCategories = DEFAULT_CATEGORIES[formData.type];

    // 計算顯示金額 - 編輯時不需要顯示餘額變化
    const displayAmount = formData.amount ? parseFloat(formData.amount) : 0;

    return (
        <div className="h-full flex flex-col">
            {/* 金額顯示 */}
            <div className="text-end mb-6">
                {currentAmount === displayAmount.toString() && (
                    <>
                        <div className="flex gap-3 justify-end">
                            <div
                                className={`text-lg font-bold ${
                                    formData.type === "income"
                                        ? "text-success"
                                        : "text-error"
                                }`}
                            >
                                {formData.type === "income" ? "+" : "-"}$
                                {displayAmount.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-3xl font-bold ">
                            ${currentBalance.toLocaleString()}
                        </div>
                    </>
                )}
                {currentAmount !== displayAmount.toString() && (
                    <>
                        <div className="flex gap-3 justify-end">
                            <div
                                className={`${currentAmount === displayAmount.toString() ? "hidden" : "text-lg"} font-bold line-through ${transaction.type === "income" ? "text-success" : "text-error"}`}
                            >
                                {transaction.type === "income" ? "+" : "-"}$
                                {currentAmount}
                            </div>
                            <div
                                className={`text-lg font-bold ${formData.type === "income" ? "text-success" : "text-error"}`}
                            >
                                {formData.type === "income" ? "+" : "-"}$
                                {displayAmount.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-3xl font-bold ">
                            ${newBalance.toLocaleString()}
                        </div>
                    </>
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

                        {/* 交易描述 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                交易描述
                            </legend>
                            <textarea
                                className="textarea validator w-full h-24"
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
                            <p className="label">請詳細描述此筆交易</p>
                        </fieldset>

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
            <div className="flex justify-between pt-4">
                {/* 左側刪除按鈕 */}
                <button
                    type="button"
                    className="btn btn-error btn-outline"
                    onClick={handleDeleteClick}
                    disabled={loading}
                >
                    <TrashIcon className="h-4 w-4" />
                    刪除交易
                </button>

                {/* 右側操作按鈕 */}
                <div className="flex gap-3">
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
                            loading ||
                            !formData.amount ||
                            !formData.description.trim() ||
                            !formData.category.trim()
                        }
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                更新中...
                            </>
                        ) : (
                            "確認更新"
                        )}
                    </button>
                </div>
            </div>

            {/* 刪除確認 Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                transaction={transaction}
                wallet={wallet}
                onSuccess={handleDeleteConfirm}
            />
        </div>
    );
}

EditTransactionForm.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number,
        balance: PropTypes.number,
        currentBalance: PropTypes.number,
    }).isRequired,
    transaction: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};
