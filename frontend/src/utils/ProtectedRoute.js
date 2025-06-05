import { Navigate } from "react-router-dom"
import { Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/login" />
}
