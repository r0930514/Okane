'use client';

import { useRouter, usePathname } from "next/navigation";
import SideBarItem from "./SideBarItem";
import { NAVIGATION_ITEMS, DEFAULT_ACTIVE_ITEM, NavigationItem } from "@/app/dashboard/constants/navigation";
import { SignOutIcon } from "@phosphor-icons/react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SideBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();

    // 根據當前路徑判斷哪個項目應該被高亮
    const getActiveItem = (): string => {
        const matchedItem = NAVIGATION_ITEMS.find(item => item.path === pathname);
        return matchedItem ? matchedItem.text : DEFAULT_ACTIVE_ITEM;
    };

    const handleItemClick = (itemText: string, itemId: string, path: string) => {
        if (path) {
            router.push(path);
        }
    };

    const handleLogout = async () => {
        if (confirm("確定要登出嗎？")) {
            await logout();
        }
    };

    const activeItem = getActiveItem();

    return (
        <aside className="flex flex-col h-screen w-60 bg-[#FAFAFA] border-r border-gray-200" role="navigation" aria-label="主要導航">
            {/* Logo/Brand Section */}
            <div className="flex items-center justify-center px-6 py-4 border-b border-gray-100">
                <div className="flex text-xl font-bold text-gray-800 tracking-tight">
                    <span className="text-blue-600">O</span>
                    <span>kane</span>
                </div>
            </div>
            
            {/* Navigation Menu - Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-3">
                    <ul className="space-y-2">
                        {NAVIGATION_ITEMS.map((item: NavigationItem) => (
                            <SideBarItem
                                key={item.id}
                                icon={item.icon}
                                text={item.text}
                                isFocused={activeItem === item.text}
                                onClick={() => handleItemClick(item.text, item.id, item.path)}
                            />
                        ))}
                    </ul>
                </div>
            </div>

            {/* User Info Section - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="dropdown dropdown-top dropdown-end">
                    <div tabIndex={0} role="button" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 w-full">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">U</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-700 truncate">
                                User
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                                user@example.com
                            </span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-white rounded-lg w-48 border border-gray-200 mb-2">
                        <li className="mb-2">
                            <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">U</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">User</span>
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
        </aside>
    );
}