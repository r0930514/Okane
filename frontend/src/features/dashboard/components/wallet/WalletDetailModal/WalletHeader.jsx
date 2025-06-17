import PropTypes from "prop-types";
import { WALLET_ICON_MAP, WALLET_TYPE_NAMES } from '../../../constants/walletConstants';

export default function WalletHeader({ wallet }) {
    const SelectedWalletIcon = WALLET_ICON_MAP[wallet.walletType] || WALLET_ICON_MAP.manual;
    const walletColor = wallet.walletColor || '#10b981';
    
    const headerStyle = {
        backgroundColor: `${walletColor}20`, // 添加透明度，和 WalletListCard 一樣
        borderColor: `${walletColor}40`,
    };

    return (
        <div 
            className="w-1/4 px-8 py-8 rounded-2xl flex flex-col items-left justify-left "
            style={headerStyle}
        >
            {/* <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: walletColor }}
            >
                <SelectedWalletIcon size={24} className="text-white" />
            </div> */}
            <div className="text-left">
                <p className="text-base-content/60 text-base">
                    {WALLET_TYPE_NAMES[wallet.walletType] || wallet.walletType}
                </p>
                <h3 className="text-2xl font-bold mb-2">{wallet.walletName}</h3>
            </div>
        </div>
    );
}

WalletHeader.propTypes = {
    wallet: PropTypes.shape({
        walletName: PropTypes.string.isRequired,
        walletType: PropTypes.string.isRequired,
        walletColor: PropTypes.string
    }).isRequired
};
