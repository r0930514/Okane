'use client';

import { ListIcon, UserCircleIcon, SignOutIcon, ArrowsClockwiseIcon, PlusIcon } from "@phosphor-icons/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

interface NavBarProps {
    username?: string;
}

export default function NavBar({ username = "User" }: NavBarProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { logout } = useAuth();

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

    const handleLogout = async () => {
        if (confirm("確定要登出嗎？")) {
            await logout();
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <label htmlFor="drawer" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md lg:hidden transition-colors duration-200">
                        <ListIcon size={20} />
                    </label>
                    <div className="flex items-center ml-2 lg:hidden">
                        <div className="w-6 h-6 rounded flex items-center justify-center">
                            <span className="text-blue-600 font-bold">O</span>
                        </div>
                        <span className="font-semibold text-gray-800">kane</span>
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

                    {/* 用戶下拉菜單 */}
                    <div className="dropdown dropdown-end ml-2">
                        <div tabIndex={0} role="button" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-gray-700">{username}</span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-white rounded-lg w-48 border border-gray-200">
                            <li className="mb-2">
                                <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                            {username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">{username}</span>
                                        <span className="text-xs text-gray-500">user@example.com</span>
                                    </div>
                                </div>
                            </li>
                            <div className="border-t border-gray-100 my-1"></div>
                            <li>
                                <button onClick={handleLogout} className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 w-full text-left">
                                    <SignOutIcon size={16} />
                                    <span className="text-sm">登出</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}