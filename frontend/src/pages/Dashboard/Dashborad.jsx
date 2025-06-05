import UserService from "../../services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import SideBar from './components/SideBar.jsx';
import WalletSummary from './components/WalletSummary.jsx';
import "@fontsource/roboto-condensed/400.css";
import WalletList from "./components/WalletList.jsx";

export default function Dashboard() {
    const [username] = useState(UserService.getUser().username);
    const nav = useNavigate();
    return (
        <div>
            <div className="drawer mx-auto max-w-[100rem] lg:drawer-open">
                {/* Content */}
                <input id="drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-start justify-start h-full">
                    {/* Navbar */}
                    { NavBar(nav, username) }
                    { WalletSummary()}
                    { WalletList() }
                </div>

                {/* Sidebar */}
                <div className="drawer-side">
                    <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    { SideBar() }
                </div>
            </div>
        </div>

    )
}