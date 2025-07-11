import { HouseIcon, WaveSawtoothIcon, GearIcon, QuestionIcon } from "@phosphor-icons/react";
import { ReactElement } from "react";

export interface NavigationItem {
    icon: ReactElement;
    text: string;
    id: string;
    path: string;
}

// 簡化的導航項目，移除分組
export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        icon: <HouseIcon size={20} />,
        text: "總覽",
        id: "overview",
        path: "/dashboard"
    },
    {
        icon: <WaveSawtoothIcon size={20} />,
        text: "分析",
        id: "analytics",
        path: "/dashboard/analytics"
    },
    {
        icon: <GearIcon size={20} />,
        text: "設定",
        id: "settings",
        path: "/dashboard/settings"
    },
    {
        icon: <QuestionIcon size={20} />,
        text: "幫助",
        id: "help",
        path: "/dashboard/help"
    }
];

export const DEFAULT_ACTIVE_ITEM = "總覽";