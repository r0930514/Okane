import { ListIcon, UserCircleIcon, SignOutIcon, ArrowsClockwiseIcon, PlusIcon } from "@phosphor-icons/react"
import { useAuth } from "../../../auth/hooks/useAuth";
import { useState } from "react"
import PropTypes from 'prop-types'

export default function NavBar({ navigate, username }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { logout } = useAuth();

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // 模擬刷新操作
        setTimeout(() => {
            setIsRefreshing(false)
            console.log("數據已刷新")
        }, 1500)
    }

    const handleAddNew = () => {
        console.log("新增資產/錢包")
        // 這裡之後可以打開新增資產的模態框
    }

    const handleLogout = async () => {
        if (confirm("確定要登出嗎？")) {
            await logout(); // 待後續整合 AuthService
            navigate('/');
        }
    }

    return (
        <nav className="navbar w-full shadow-xs bg-base-100 border-b border-base-200">
            <div className="flex-none">
                <label htmlFor="drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
                    <ListIcon size={24} />
                </label>
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl gap-0 font-bold hidden lg:flex">
                    {/* <span className="text-blue-600">O</span>kane */}
                    
                </a>
            </div>
            <div className="flex-none pr-2 gap-2">
                {/* 用戶下拉菜單 */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                        <UserCircleIcon size={24} />
                        <span className="hidden lg:flex">{username}</span>
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-sm bg-base-100 rounded-box w-52">
                        <li>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                                <SignOutIcon size={20} />
                                登出
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* 刷新按鈕 */}
                <button 
                    className={`btn btn-ghost btn-square`}
                    onClick={handleRefresh}
                    // disabled={isRefreshing}
                    title="更新數據"
                >
                    {isRefreshing ?
                        <div className="loading loading-sm"></div>:
                        <ArrowsClockwiseIcon
                            size={24} 
                            className={isRefreshing ? 'animate-spin' : ''} 
                        />
                    }
                </button>
                
                {/* 新增按鈕 */}
                <button 
                    className="btn btn-ghost btn-square"
                    onClick={handleAddNew}
                    title="新增資產"
                >
                    <PlusIcon size={24} />
                </button>
            </div>
        </nav>
    )
}

NavBar.propTypes = {
    navigate: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
}
