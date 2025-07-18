'use client';

import { ReactElement } from 'react';

interface SideBarItemProps {
    icon: ReactElement;
    text: string;
    isFocused?: boolean;
    onClick?: () => void;
    isCollapsed?: boolean;
}

export default function SideBarItem({ icon, text, isFocused = false, onClick, isCollapsed = false }: SideBarItemProps) {
    const baseClasses = `
        flex items-center gap-3 px-3 py-2 rounded-md text-[16px] font-medium
        transition-colors duration-200 cursor-pointer relative
        ${isFocused 
            ? 'bg-gray-200 text-neutral' 
            : 'text-[#374151] hover:text-gray-900 hover:bg-gray-50'
        }
        ${isCollapsed ? 'lg:justify-center' : ''}
    `;

    return (
        <li>
            <div className={isCollapsed ? "lg:tooltip lg:tooltip-right" : ""} data-tip={isCollapsed ? text : ""}>
                <a 
                    className={baseClasses}
                    onClick={(e) => {
                        e.preventDefault();
                        onClick?.();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick?.();
                        }
                    }}
                >
                    <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-gray-800`}>
                        {icon}
                    </div>
                    <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                        {text}
                    </span>
                </a>
            </div>
        </li>
    );
}