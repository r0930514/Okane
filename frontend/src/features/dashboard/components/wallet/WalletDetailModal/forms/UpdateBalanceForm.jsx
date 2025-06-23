import PropTypes from "prop-types";
import { useState } from "react";
import { CurrencyDollarIcon } from "@phosphor-icons/react";
import { useTransactions } from "../../../../hooks/useTransactions";

export default function UpdateBalanceForm({ wallet, onCancel, onSuccess }) {
    const [targetBalance, setTargetBalance] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { createTransaction } = useTransactions(wallet?.id);

    const currentBalance = wallet?.balance || wallet?.currentBalance || 0;
    const newBalance = targetBalance
        ? parseFloat(targetBalance)
        : currentBalance;
    const adjustmentAmount = targetBalance
        ? parseFloat(targetBalance) - currentBalance
        : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!targetBalance || parseFloat(targetBalance) === currentBalance) {
            setError("請輸入目標餘額");
            return;
        }

        if (!description.trim()) {
            setError("請輸入調整說明");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const transactionData = {
                amount: parseFloat(adjustmentAmount),
                type: parseFloat(adjustmentAmount) > 0 ? "income" : "expense",
                description: description.trim(),
                category: "餘額調整",
                date: new Date().toISOString().split("T")[0],
            };

            const result = await createTransaction(transactionData);

            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || "更新失敗");
            }
        } catch (err) {
            setError("系統錯誤，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    const handleTargetBalanceChange = (e) => {
        const value = e.target.value;
        // 只允許正數和小數點
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setTargetBalance(value);
            setError("");
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* 金額顯示 - 響應式設計 */}
            <div className="text-center lg:text-end mb-4 lg:mb-6">
                {targetBalance && parseFloat(adjustmentAmount) !== 0 && (
                    <>
                        <div
                            className={`text-base lg:text-lg font-medium ${
                                parseFloat(adjustmentAmount) > 0
                                    ? "text-success"
                                    : "text-error"
                            }`}
                        >
                            {parseFloat(adjustmentAmount) > 0 ? "+" : "-"}$
                            {Math.abs(
                                parseFloat(adjustmentAmount),
                            ).toLocaleString()}
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold">
                            ${newBalance.toLocaleString()}
                        </div>
                    </>
                )}
                {(!targetBalance || parseFloat(adjustmentAmount) === 0) && (
                    <div className="text-2xl lg:text-3xl font-bold">
                        ${currentBalance.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Tab 內容 */}
            <div className="flex-1 overflow-y-auto px-2" role="tabpanel">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1 pr-2">
                        {/* 當前餘額顯示 */}
                        <div className="card card-border bg-base-200 p-4">
                            <h4 className="font-medium mb-2">餘額資訊</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>當前餘額：</span>
                                    <span className="font-semibold">
                                        ${currentBalance.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>調整後餘額：</span>
                                    <span
                                        className={`font-semibold ${
                                            newBalance >= 0
                                                ? "text-success"
                                                : "text-error"
                                        }`}
                                    >
                                        ${newBalance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 目標餘額 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                目標餘額
                            </legend>
                            <label className="input validator w-full">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="請輸入要調整到的目標餘額"
                                    value={targetBalance}
                                    onChange={handleTargetBalanceChange}
                                    disabled={loading}
                                />
                            </label>
                            <p className="label">
                                請輸入您希望錢包調整到的餘額數值
                            </p>
                        </fieldset>

                        {/* 調整說明 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                調整說明
                            </legend>
                            <textarea
                                className="textarea validator w-full"
                                placeholder="請說明此次餘額調整的原因"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                                rows={3}
                            />
                            <p className="label">
                                請詳細說明此次餘額調整的原因
                            </p>
                        </fieldset>

                        {/* 預覽 */}
                        {targetBalance &&
                            parseFloat(adjustmentAmount) !== 0 &&
                            description && (
                            <div className="card card-border p-4">
                                <h4 className="font-medium mb-2">
                                        調整預覽
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>類型：</span>
                                        <span
                                            className={
                                                parseFloat(
                                                    adjustmentAmount,
                                                ) > 0
                                                    ? "text-success"
                                                    : "text-error"
                                            }
                                        >
                                            {parseFloat(adjustmentAmount) >
                                                0
                                                ? "餘額增加"
                                                : "餘額減少"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>金額：</span>
                                        <span
                                            className={
                                                parseFloat(
                                                    adjustmentAmount,
                                                ) > 0
                                                    ? "text-success font-semibold"
                                                    : "text-error font-semibold"
                                            }
                                        >
                                            {parseFloat(adjustmentAmount) >
                                                0
                                                ? "+"
                                                : "-"}
                                                $
                                            {Math.abs(
                                                parseFloat(
                                                    adjustmentAmount,
                                                ),
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>分類：</span>
                                        <span>餘額調整</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>日期：</span>
                                        <span>
                                            {
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        </span>
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

            {/* 完成按鈕 - 響應式設計 */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-2 sm:gap-3 pt-4">
                <button
                    type="button"
                    className="btn btn-md w-full sm:w-auto"
                    onClick={onCancel}
                    disabled={loading}
                >
                    取消
                </button>
                <button
                    type="submit"
                    className="btn btn-primary btn-md w-full sm:w-auto"
                    onClick={handleSubmit}
                    disabled={loading || !targetBalance || !description.trim()}
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            處理中...
                        </>
                    ) : (
                        "確認更新"
                    )}
                </button>
            </div>
        </div>
    );
}

UpdateBalanceForm.propTypes = {
    wallet: PropTypes.shape({
        id: PropTypes.number,
        balance: PropTypes.number,
        currentBalance: PropTypes.number,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};
