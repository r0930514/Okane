import PropTypes from "prop-types";
import { GearIcon } from "@phosphor-icons/react";
import { formatDate } from "../../../../../../shared/utils/formatUtils";
import {
    WALLET_TYPE_NAMES,
    CURRENCY_OPTIONS,
} from "../../../../constants/walletConstants";
import { useState } from "react";
import { useWallets } from "../../../../hooks/useWallets";

export default function SettingsTab({ wallet }) {
    const { updateWallet } = useWallets();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        walletName: wallet.walletName || "",
        accountNumber: wallet.accountNumber || "",
        walletType: wallet.walletType || "manual",
        walletColor: wallet.walletColor || "#10b981",
        initialBalance: wallet.initialBalance || 0,
        currency: wallet.currency || "TWD",
        operationMode: wallet.operationMode || "manual_only",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "initialBalance"
                    ? value === ""
                        ? 0
                        : Number(value)
                    : value,
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const result = await updateWallet(wallet.id, formData);
            if (result.success) {
                setSuccess("更新成功！");
                setEditing(false);
            } else {
                setError(result.error || "更新失敗");
            }
        } catch (err) {
            setError("系統錯誤，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* 錢包資訊 */}
            <div className="card bg-base-100 p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <GearIcon size={20} />
                    錢包資訊
                </h4>
                {!editing ? (
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                錢包名稱：
                            </span>
                            <span className="font-medium">
                                {wallet.walletName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                帳戶號碼：
                            </span>
                            <span className="font-medium">
                                {wallet.accountNumber || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                錢包類型：
                            </span>
                            <span className="font-medium">
                                {WALLET_TYPE_NAMES[wallet.walletType] ||
                                    wallet.walletType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                主幣別：
                            </span>
                            <span className="font-medium">
                                {wallet.currency || "TWD"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                初始餘額：
                            </span>
                            <span className="font-medium">
                                {wallet.initialBalance ?? 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                建立日期：
                            </span>
                            <span className="font-medium">
                                {formatDate(wallet.createdAt)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">
                                最後更新：
                            </span>
                            <span className="font-medium">
                                {formatDate(wallet.updatedAt)}
                            </span>
                        </div>
                        {wallet.description && (
                            <div className="flex justify-between">
                                <span className="text-base-content/60">
                                    描述：
                                </span>
                                <span className="font-medium">
                                    {wallet.description}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {/* 錢包名稱 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                錢包名稱
                            </legend>
                            <label className="input validator w-full">
                                <input
                                    type="text"
                                    className="grow"
                                    name="walletName"
                                    placeholder="請輸入錢包名稱"
                                    value={formData.walletName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </label>
                        </fieldset>
                        {/* 帳戶號碼 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                帳戶號碼
                            </legend>
                            <label className="input validator w-full">
                                <input
                                    type="text"
                                    className="grow"
                                    name="accountNumber"
                                    placeholder="請輸入帳戶號碼"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </label>
                        </fieldset>
                        {/* 錢包類型 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                錢包類型
                            </legend>
                            <select
                                className="select select-md w-full mb-2"
                                name="walletType"
                                value={formData.walletType}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="manual">手動</option>
                                <option value="sync">同步</option>
                                <option value="crypto">加密貨幣</option>
                                <option value="bank">銀行帳戶</option>
                                <option value="credit">信用卡</option>
                                <option value="investment">投資帳戶</option>
                                <option value="savings">儲蓄帳戶</option>
                                <option value="cash">現金帳戶</option>
                            </select>
                        </fieldset>
                        {/* 主幣別 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">主幣別</legend>
                            <select
                                className="select select-md w-full mb-2"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                {CURRENCY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                        {/* 錢包顏色 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                錢包顏色
                            </legend>
                            <label className="input validator w-full">
                                <input
                                    type="color"
                                    className="w-16 h-12"
                                    name="walletColor"
                                    value={formData.walletColor}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </label>
                        </fieldset>
                        {/* 初始餘額 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                初始餘額
                            </legend>
                            <label className="input validator w-full">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="grow"
                                    name="initialBalance"
                                    value={formData.initialBalance}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            initialBalance:
                                                value === ""
                                                    ? 0
                                                    : Number(value),
                                        }));
                                    }}
                                    disabled={loading}
                                />
                            </label>
                        </fieldset>
                        {/* 操作模式 */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                操作模式
                            </legend>
                            <select
                                className="select select-md w-full mb-2"
                                name="operationMode"
                                value={formData.operationMode}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="manual_only">僅手動</option>
                                <option value="sync_only">僅同步</option>
                                <option value="hybrid">混合模式</option>
                            </select>
                        </fieldset>
                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success">
                                <span>{success}</span>
                            </div>
                        )}
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setEditing(false)}
                                disabled={loading}
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                儲存
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 錢包設定選項 */}
            <div className="card bg-base-100 p-4">
                <h4 className="font-semibold mb-4">設定選項</h4>
                <div className="space-y-3">
                    <button
                        className="btn btn-outline w-full justify-start"
                        onClick={() => setEditing(true)}
                        disabled={editing}
                    >
                        編輯錢包資訊
                    </button>
                    <button
                        className="btn btn-outline w-full justify-start"
                        disabled
                    >
                        變更錢包顏色
                    </button>
                    <button
                        className="btn btn-outline w-full justify-start"
                        disabled
                    >
                        匯出交易記錄
                    </button>
                    <button
                        className="btn btn-error btn-outline w-full justify-start"
                        disabled
                    >
                        刪除錢包
                    </button>
                </div>
            </div>
        </div>
    );
}

SettingsTab.propTypes = {
    wallet: PropTypes.shape({
        walletName: PropTypes.string.isRequired,
        walletType: PropTypes.string.isRequired,
        accountNumber: PropTypes.string,
        walletColor: PropTypes.string,
        balance: PropTypes.number,
        currency: PropTypes.string,
        operationMode: PropTypes.string,
        initialBalance: PropTypes.number,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};
