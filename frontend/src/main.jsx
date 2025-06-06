import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage.jsx'
import AuthPage from './pages/AuthPages/AuthPage.jsx'
import HomePage from './pages/Homepage/HomePage.jsx'
import Dashboard from './pages/Dashboard/Dashborad.jsx'

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
            element: <Dashboard />,
            errorElement: <ErrorPage />
        },

    ]
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
