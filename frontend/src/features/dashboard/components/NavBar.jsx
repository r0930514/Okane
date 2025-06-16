import { List, Plus, ArrowsClockwise, UserCircle, SignOut } from "@phosphor-icons/react"
import { useState } from "react"

export default function NavBar(nav, username) {
    const [isRefreshing, setIsRefreshing] = useState(false)

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

    const handleLogout = () => {
        if (confirm("確定要登出嗎？")) {
            // AuthService.logout(); // 待後續整合 AuthService
            nav('/');
        }
    }

    return (
        <nav className="navbar w-full shadow-sm bg-base-100">
            <div className="flex-none">
                <label htmlFor="drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
                    <List size={24} />
                </label>
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl gap-0 font-bold hidden lg:flex">
                    {/* <span className="text-blue-600">O</span>kane */}
                    總覽
                </a>
            </div>
            <div className="flex-none pr-2 gap-2">
                {/* 用戶下拉菜單 */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                        <UserCircle size={24} />
                        <span className="hidden lg:flex">{username}</span>
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                                <SignOut size={20} />
                                登出
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* 刷新按鈕 */}
                <button 
                    className={`btn btn-ghost btn-square ${isRefreshing ? 'loading' : ''}`}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="刷新數據"
                >
                    <ArrowsClockwise 
                        size={24} 
                        className={isRefreshing ? 'animate-spin' : ''} 
                    />
                </button>
                
                {/* 新增按鈕 */}
                <button 
                    className="btn btn-ghost btn-square"
                    onClick={handleAddNew}
                    title="新增資產"
                >
                    <Plus size={24} />
                </button>
            </div>
        </nav>
    )
}
