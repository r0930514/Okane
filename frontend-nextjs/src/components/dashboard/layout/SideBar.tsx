'use client';

import { useRouter, usePathname } from "next/navigation";
import SideBarItem from "./SideBarItem";
import { NAVIGATION_GROUPS, NAVIGATION_ITEMS, DEFAULT_ACTIVE_ITEM, NavigationItem, NavigationGroup } from "@/app/dashboard/constants/navigation";

export default function SideBar() {
    const router = useRouter();
    const pathname = usePathname();

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

    const activeItem = getActiveItem();

    return (
        <aside className="flex flex-col h-full w-60 bg-base-100 border border-base-200" role="navigation" aria-label="主要導航">
            {/* Logo/Brand Section */}
            <div className="flex items-center justify-center p-4 bg-base-100 flex-shrink-0">
                <div className="flex text-3xl font-bold" style={{ fontFamily: 'Roboto Condensed' }}>
                    <span className="text-primary">O</span>
                    <span className="text-base-content">kane</span>
                </div>
            </div>
            
            {/* Navigation Menu - Scrollable Area */}
            <div className="flex-1 overflow-y-auto">
                {NAVIGATION_GROUPS.map((group: NavigationGroup) => (
                    <div key={group.title}>
                        <ul className="menu bg-base-100 rounded-box w-full">
                            <li>
                                <h2 className="menu-title text-base font-semibold">
                                    {group.title}
                                </h2>
                            </li>
                            {group.items.map((item: NavigationItem) => (
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
                ))}
            </div>

            {/* User Info Section - Fixed at Bottom */}
            <div className="p-4 border-t border-base-300 bg-base-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-accent text-primary-content rounded-full w-10">
                            {/* User avatar placeholder */}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-base-content">
                            User
                        </span>
                        <span className="text-xs text-base-content/70">
                            user@example.com
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}