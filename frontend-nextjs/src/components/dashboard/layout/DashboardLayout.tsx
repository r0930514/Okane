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
        <div className="drawer lg:drawer-open h-screen overflow-hidden">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            
            {/* Main content */}
            <div className="drawer-content flex flex-col h-full">
                {/* Navbar - 固定在頂端 */}
                <div className="flex-shrink-0 sticky top-0 z-50">
                    <NavBar username={username} />
                </div>
                
                {/* Main content - 可捲動區域 */}
                <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <SideBar />
            </div>
        </div>
    );
}