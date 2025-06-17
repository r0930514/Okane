import { UserService } from "../../../shared";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, SideBar, WalletList, StatsOverview } from "..";
import { useWallets } from "../hooks/useWallets";
import "@fontsource/roboto-condensed/400.css";

export default function Dashboard() {
    const [username] = useState(UserService.getUser().username);
    const { wallets } = useWallets();
    const nav = useNavigate();
    return (
        <div>
            <div className="drawer mx-auto max-w-400 lg:drawer-open">
                {/* Content */}
                <input id="drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-start justify-start h-full">
                    {/* Navbar */}
                    { NavBar(nav, username) }
                    
                    {/* Main Content */}
                    <div className="w-full px-6 py-4">
                        <StatsOverview wallets={wallets} />
                        { WalletList() }
                    </div>
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
