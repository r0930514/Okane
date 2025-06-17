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
        <div className="drawer mx-auto lg:drawer-open">
            {/* Content */}
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start h-full">
                {/* Navbar */}
                <NavBar navigate={navigate} username={username} />
                
                {/* Main content */}
                <main className="flex-1 w-full">
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

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
