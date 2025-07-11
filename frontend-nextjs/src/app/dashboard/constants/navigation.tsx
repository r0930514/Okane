import { HouseIcon, ReceiptIcon, WaveSawtoothIcon, ListMagnifyingGlassIcon, GearIcon, QuestionIcon, WalletIcon } from "@phosphor-icons/react";
import { ReactElement } from "react";

export interface NavigationItem {
    icon: ReactElement;
    text: string;
    id: string;
    path: string;
}

export interface NavigationGroup {
    title: string;
    items: NavigationItem[];
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
    {
        title: "主要功能",
        items: [
            {
                icon: <HouseIcon size={16} />,
                text: "總覽",
                id: "overview",
                path: "/dashboard"
            },
            {
                icon: <WalletIcon size={16} />,
                text: "錢包管理",
                id: "wallets",
                path: "/dashboard/wallets"
            },
            {
                icon: <ReceiptIcon size={16} />,
                text: "交易管理",
                id: "transactions",
                path: "/dashboard/transactions"
            }
        ]
    },
    {
        title: "分析工具❌",
        items: [
            {
                icon: <WaveSawtoothIcon size={16} />,
                text: "趨勢圖",
                id: "trends",
                path: "/dashboard/trends"
            },
            {
                icon: <ListMagnifyingGlassIcon size={16} />,
                text: "所有紀錄",
                id: "records",
                path: "/dashboard/records"
            }
        ]
    },
    {
        title: "系統功能",
        items: [
            {
                icon: <GearIcon size={16} />,
                text: "設定",
                id: "settings",
                path: "/dashboard/settings"
            },
            {
                icon: <QuestionIcon size={16} />,
                text: "幫助",
                id: "help",
                path: "/dashboard/help"
            }
        ]
    }
];

// 為了向後相容，保留扁平化的 NAVIGATION_ITEMS
export const NAVIGATION_ITEMS: NavigationItem[] = NAVIGATION_GROUPS.flatMap(group => group.items);

export const DEFAULT_ACTIVE_ITEM = "總覽";