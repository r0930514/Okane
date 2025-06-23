import PropTypes from 'prop-types';
import NavBar from './NavBar.jsx';
import SideBar from './SideBar.jsx';
import { UserService } from '../../../../shared';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
    const [username] = useState(UserService.getUser()?.username || 'User');
    const navigate = useNavigate();

    return (
        <div className="drawer mx-auto lg:drawer-open h-screen">
            {/* Content */}
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col h-full">
                {/* Navbar - 固定在頂端 */}
                <div className="sticky top-0 z-50">
                    <NavBar navigate={navigate} username={username} />
                </div>
                
                {/* Main content - 可捲動區域 */}
                <main className="flex-1 overflow-y-auto">
                    {children}
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

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
