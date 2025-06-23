import PropTypes from "prop-types";
import { GearIcon } from "@phosphor-icons/react";
import { formatDate } from '../../../../../../shared/utils/formatUtils';
import { WALLET_TYPE_NAMES } from '../../../../constants/walletConstants';

export default function SettingsTab({ wallet }) {
    return (
        <div className="space-y-4">
            {/* 錢包資訊 */}
            <div className="card bg-base-100 p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <GearIcon size={20} />
                    錢包資訊
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-base-content/60">錢包名稱：</span>
                        <span className="font-medium">{wallet.walletName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-base-content/60">錢包類型：</span>
                        <span className="font-medium">
                            {WALLET_TYPE_NAMES[wallet.walletType] || wallet.walletType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-base-content/60">建立日期：</span>
                        <span className="font-medium">{formatDate(wallet.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-base-content/60">最後更新：</span>
                        <span className="font-medium">{formatDate(wallet.updatedAt)}</span>
                    </div>
                    {wallet.description && (
                        <div className="flex justify-between">
                            <span className="text-base-content/60">描述：</span>
                            <span className="font-medium">{wallet.description}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 錢包設定選項 */}
            <div className="card bg-base-100 p-4">
                <h4 className="font-semibold mb-4">設定選項</h4>
                <div className="space-y-3">
                    <button className="btn btn-outline w-full justify-start">
                        編輯錢包資訊
                    </button>
                    <button className="btn btn-outline w-full justify-start">
                        變更錢包顏色
                    </button>
                    <button className="btn btn-outline w-full justify-start">
                        匯出交易記錄
                    </button>
                    <button className="btn btn-error btn-outline w-full justify-start">
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
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        description: PropTypes.string
    }).isRequired
};
