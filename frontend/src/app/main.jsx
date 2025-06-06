import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ErrorPage } from '../shared'
import { AuthPage } from '../features/auth'
import { HomePage } from '../features/homepage'
import { Dashboard } from '../features/dashboard'

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
