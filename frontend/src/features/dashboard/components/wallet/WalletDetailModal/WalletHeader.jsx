import PropTypes from "prop-types";
import { ArrowsClockwiseIcon, PlusIcon } from "@phosphor-icons/react";
import { WALLET_TYPE_NAMES } from '../../../constants/walletConstants';

export default function WalletHeader({ wallet, onUpdateBalance, onAddTransaction }) {
    const walletColor = wallet.walletColor || '#10b981';
    
    const headerStyle = {
        backgroundColor: `${walletColor}20`, // 添加透明度，和 WalletListCard 一樣
        borderColor: `${walletColor}40`,
    };

    const primaryButtonStyle = {
        background: `linear-gradient(135deg, ${walletColor}, ${walletColor}dd)`,
        color: 'white',
        border: 'none',
        boxShadow: `0 2px 8px ${walletColor}40`
    };

    const secondaryButtonStyle = {
        backgroundColor: `${walletColor}15`,
        color: walletColor,
        border: `1px solid ${walletColor}30`,
        backdropFilter: 'blur(10px)'
    };

    return (
        <div 
            className="h-full px-4 py-4 lg:px-8 lg:py-8 rounded-2xl flex flex-col lg:flex-col items-left justify-between border-1 border-base-content/20"
            style={headerStyle}
        >
            {/* 錢包資訊 - 小裝置水平佈局，大裝置垂直佈局 */}
            <div className="flex lg:flex-col items-center lg:items-start lg:text-left lg:mb-0">
                <div className="flex-1 lg:flex-none">
                    <p className="text-base-content/60 text-sm lg:text-base">
                        {WALLET_TYPE_NAMES[wallet.walletType] || wallet.walletType}
                    </p>
                    <h3 className="text-lg lg:text-2xl font-bold mb-0 lg:mb-2">{wallet.walletName}</h3>
                </div>
                
                {/* 手機版按鈕 - 在錢包名稱旁邊 */}
                <div className="flex gap-2 lg:hidden">
                    <button 
                        className="btn btn-sm transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
                        style={primaryButtonStyle}
                        onClick={onUpdateBalance}
                    >
                        <ArrowsClockwiseIcon size={14} weight="bold" />
                    </button>
                    <button 
                        className="btn btn-sm transition-all duration-200 hover:scale-105 flex items-center justify-center"
                        style={secondaryButtonStyle}
                        onClick={onAddTransaction}
                    >
                        <PlusIcon size={14} weight="bold" />
                    </button>
                </div>
            </div>
            
            {/* 桌面版按鈕 - 垂直佈局，顯示完整文字 */}
            <div className="hidden lg:flex flex-col gap-3">
                <button 
                    className="btn btn-md w-full transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    style={primaryButtonStyle}
                    onClick={onUpdateBalance}
                >
                    <ArrowsClockwiseIcon size={16} weight="bold" />
                    更新餘額
                </button>
                <button 
                    className="btn btn-md w-full transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    style={secondaryButtonStyle}
                    onClick={onAddTransaction}
                >
                    <PlusIcon size={16} weight="bold" />
                    新增記錄
                </button>
            </div>
        </div>
    );
}

WalletHeader.propTypes = {
    wallet: PropTypes.shape({
        walletName: PropTypes.string.isRequired,
        walletType: PropTypes.string.isRequired,
        walletColor: PropTypes.string
    }).isRequired,
    onUpdateBalance: PropTypes.func.isRequired,
    onAddTransaction: PropTypes.func.isRequired
};
