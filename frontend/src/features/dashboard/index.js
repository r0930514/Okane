// Dashboard feature barrel exports
export { default as Dashboard } from './pages/Dashboard.jsx';
export { default as WalletManagement } from './pages/WalletManagement.jsx';
export { default as TransactionManagement } from './pages/TransactionManagement.jsx';
export { default as SettingsPage } from './pages/Settings.jsx';

// Layout Components
export { default as NavBar } from './components/layout/NavBar.jsx';
export { default as SideBar } from './components/layout/SideBar.jsx';
export { default as SideBarItem } from './components/layout/SideBarItem.jsx';
export { default as DashboardLayout } from './components/layout/DashboardLayout.jsx';

// Wallet Components
export { default as WalletList } from './components/wallet/WalletList.jsx';
export { default as WalletListCard } from './components/wallet/WalletListCard.jsx';

// Stats Components
export { default as StatsOverview } from './components/stats/StatsOverview.jsx';

// Hooks
export { useWallets } from './hooks/useWallets.js';
export { useTransactions } from './hooks/useTransactions.js';

// Constants
export * from './constants/navigation.jsx';
export * from './constants/walletConstants.jsx';
