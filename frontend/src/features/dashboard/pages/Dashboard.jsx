import { DashboardLayout, WalletList, StatsOverview } from "..";
import { useWallets } from "../hooks/useWallets";
import "@fontsource/roboto-condensed/400.css";

export default function Dashboard() {
    const { wallets } = useWallets();
    
    return (
        <DashboardLayout>
            <div className="w-full h-full">
                <StatsOverview wallets={wallets} />
                <WalletList />
            </div>
        </DashboardLayout>
    )
}
