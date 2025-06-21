import { 
    BriefcaseIcon, 
    TrophyIcon, 
    TrendUpIcon, 
    LightbulbIcon, 
    PlusIcon,  
    CarIcon, 
    ShoppingBagIcon, 
    GameControllerIcon, 
    FirstAidIcon, 
    GraduationCapIcon, 
    HouseIcon, 
    MinusIcon 
} from "@phosphor-icons/react";

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

export const VIEW_MODES = {
    DEFAULT: 'default',
    UPDATE_BALANCE: 'updateBalance',
    ADD_TRANSACTION: 'addTransaction',
    EDIT_TRANSACTION: 'editTransaction'
};

// 交易分類圖示配置
export const CATEGORY_ICONS = {
    // 收入分類
    income: {
        '薪水': <BriefcaseIcon size={16} />,
        '獎金': <TrophyIcon size={16} />,
        '投資收益': <TrendUpIcon size={16} />,
        '副業收入': <LightbulbIcon size={16} />,
        '其他收入': <PlusIcon size={16} />
    },
    // 支出分類
    expense: {
        '餐飲': <PlusIcon size={16} />,
        '交通': <CarIcon size={16} />,
        '購物': <ShoppingBagIcon size={16} />,
        '娛樂': <GameControllerIcon size={16} />,
        '醫療': <FirstAidIcon size={16} />,
        '教育': <GraduationCapIcon size={16} />,
        '居住': <HouseIcon size={16} />,
        '其他支出': <MinusIcon size={16} />
    }
};
