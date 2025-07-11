'use client';

import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/stats/StatsOverview';
import WalletList from '@/components/dashboard/wallet/WalletList';
import { useWallets } from './hooks/useWallets';

export default function Dashboard() {
    const { wallets } = useWallets();
    
    return (
        <DashboardLayout>
            <div className="w-full h-full">
                <StatsOverview wallets={wallets} />
                <WalletList />
            </div>
        </DashboardLayout>
    );
}