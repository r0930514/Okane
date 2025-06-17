import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ErrorPage, ProtectedRoute } from '../shared'
import { AuthPage } from '../features/auth'
import { HomePage } from '../features/homepage'
import { Dashboard } from '../features/dashboard'
import WalletManagement from '../features/dashboard/pages/WalletManagement'
import TransactionManagement from '../features/dashboard/pages/TransactionManagement'
import SettingsPage from '../features/dashboard/pages/Settings'

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <HomePage />,
            errorElement: <ErrorPage />
        },
        {
            path: "/login/*",
            element: <AuthPage />,
            errorElement: <ErrorPage />
        },
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
            errorElement: <ErrorPage />
        },
        {
            path: "/wallets",
            element: (
                <ProtectedRoute>
                    <WalletManagement />
                </ProtectedRoute>
            ),
            errorElement: <ErrorPage />
        },
        {
            path: "/transactions",
            element: (
                <ProtectedRoute>
                    <TransactionManagement />
                </ProtectedRoute>
            ),
            errorElement: <ErrorPage />
        },
        {
            path: "/settings",
            element: (
                <ProtectedRoute>
                    <SettingsPage />
                </ProtectedRoute>
            ),
            errorElement: <ErrorPage />
        },
    ],
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
