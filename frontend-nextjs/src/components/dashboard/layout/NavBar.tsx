'use client';

import { ArrowsClockwiseIcon, ListIcon, PlusIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, DEFAULT_ACTIVE_ITEM } from "@/app/dashboard/constants/navigation";

interface NavBarProps {
    onToggleSidebar?: () => void;
    isSidebarCollapsed?: boolean;
}

export default function NavBar({ onToggleSidebar, isSidebarCollapsed }: NavBarProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const pathname = usePathname();

    // 根據當前路徑獲取頁面名稱
    const getCurrentPageTitle = (): string => {
        const matchedItem = NAVIGATION_ITEMS.find(item => item.path === pathname);
        return matchedItem ? matchedItem.text : DEFAULT_ACTIVE_ITEM;
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // 模擬刷新操作
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    const handleAddNew = () => {
        // 這裡之後可以打開新增資產的模態框
    };


    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* 行動版 drawer 切換 */}
                    <label htmlFor="drawer" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 lg:hidden">
                        <ListIcon size={20} />
                    </label>
                    
                    {/* 桌面版 sidebar 切換 */}
                    <button 
                        onClick={onToggleSidebar}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 hidden lg:block"
                    >
                        <SidebarSimpleIcon size={20} />
                    </button>
                     <div className="flex text-xl font-bold text-gray-800 tracking-tight px-2 lg:hidden">
                        <span className="text-blue-600">O</span>
                        <span>kane</span>
                    </div>
                    <div className="flex items-center">
                        <div data-direction="Vertical" data-spacing="Regular" className="h-6 p-1 inline-flex justify-center items-start gap-2">
                                    <div className="w-px self-stretch bg-neutral-300" />
                        </div>
                        <h1 className="p-2 text-lg font-semibold text-gray-800">{getCurrentPageTitle()}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* 刷新按鈕 */}
                    <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        onClick={handleRefresh}
                        title="更新數據"
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                        ) : (
                            <ArrowsClockwiseIcon size={18} />
                        )}
                    </button>
                    
                    {/* 新增按鈕 */}
                    <button 
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={handleAddNew}
                        title="新增資產"
                    >
                        <PlusIcon size={16} className="inline mr-1" />
                        新增
                    </button>
                </div>
            </div>
        </nav>
    );
}