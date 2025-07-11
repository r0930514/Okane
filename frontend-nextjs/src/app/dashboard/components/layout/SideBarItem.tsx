'use client';

import { ReactElement } from 'react';

interface SideBarItemProps {
    icon: ReactElement;
    text: string;
    isFocused?: boolean;
    onClick?: () => void;
}

export default function SideBarItem({ icon, text, isFocused = false, onClick }: SideBarItemProps) {
    return (
        <li>
            <a 
                className={`text-base ${isFocused ? 'menu-focus' : ''}`}
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
                {icon}
                {text}
            </a>
        </li>
    );
}