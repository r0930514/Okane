import { Navigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import AuthService from "../../features/auth/services/AuthService"

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null) // null = 檢查中, true/false = 已檢查
    
    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken()
            if (!token) {
                setIsAuthenticated(false)
                return
            }
            
            // 驗證 token 是否有效
            const result = await AuthService.checkToken()
            setIsAuthenticated(result.success)
        }
        
        checkAuth()
    }, [])
    
    // 正在檢查認證狀態
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        )
    }
    
    // 已檢查完成
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
}
