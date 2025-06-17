import { 
    WalletIcon, 
    BankIcon,
    CreditCardIcon,
    CoinsIcon,
    TrendUpIcon,
    CoinIcon,
    CurrencyDollarIcon
} from "@phosphor-icons/react";

export const WALLET_ICON_MAP = {
    manual: WalletIcon,
    bank: BankIcon,
    credit: CreditCardIcon,
    crypto: CoinsIcon,
    investment: TrendUpIcon,
    savings: CoinIcon,
    cash: CurrencyDollarIcon,
    sync: WalletIcon
};

export const WALLET_TYPE_NAMES = {
    manual: '手動帳戶',
    sync: '同步帳戶',
    crypto: '加密貨幣',
    bank: '銀行帳戶',
    credit: '信用卡',
    investment: '投資帳戶',
    savings: '儲蓄帳戶',
    cash: '現金帳戶'
};

export const TAB_TYPES = {
    TRANSACTIONS: 'transactions',
    SETTINGS: 'settings'
};
