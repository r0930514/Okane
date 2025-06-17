import { HouseIcon, ReceiptIcon, WaveSawtoothIcon, ListMagnifyingGlassIcon, GearIcon, QuestionIcon, WalletIcon } from "@phosphor-icons/react";

export const NAVIGATION_GROUPS = [
    {
        title: "主要功能",
        items: [
            {
                icon: <HouseIcon size={24} />,
                text: "總覽",
                id: "overview",
                path: "/dashboard"
            },
            {
                icon: <WalletIcon size={24} />,
                text: "錢包管理",
                id: "wallets",
                path: "/wallets"
            },
            {
                icon: <ReceiptIcon size={24} />,
                text: "交易管理",
                id: "transactions",
                path: "/transactions"
            }
        ]
    },
    {
        title: "分析工具 ❌",
        items: [
            {
                icon: <WaveSawtoothIcon size={24} />,
                text: "趨勢圖",
                id: "trends",
                path: "/trends"
            },
            {
                icon: <ListMagnifyingGlassIcon size={24} />,
                text: "所有紀錄",
                id: "records",
                path: "/records"
            }
        ]
    },
    {
        title: "系統功能",
        items: [
            {
                icon: <GearIcon size={24} />,
                text: "設定",
                id: "settings",
                path: "/settings"
            },
            {
                icon: <QuestionIcon size={24} />,
                text: "幫助",
                id: "help",
                path: "/help"
            }
        ]
    }
];

// 為了向後相容，保留扁平化的 NAVIGATION_ITEMS
export const NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap(group => group.items);

export const DEFAULT_ACTIVE_ITEM = "總覽";
