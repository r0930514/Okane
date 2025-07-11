'use client';

import { ReactNode, useState } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [username] = useState('User'); // 暫時硬編碼，等 UserService 實作完成後再整合

    return (
        <div className="drawer mx-auto lg:drawer-open h-screen">
            {/* Content */}
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col h-full">
                {/* Navbar - 固定在頂端 */}
                <div className="sticky top-0 z-50">
                    <NavBar username={username} />
                </div>
                
                {/* Main content - 可捲動區域 */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4">
                        {children}
                    </div>
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-[60]">
                <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <SideBar />
            </div>
        </div>
    );
}