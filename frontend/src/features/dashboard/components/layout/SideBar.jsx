import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import SideBarItem from "./SideBarItem"
import { NAVIGATION_GROUPS, NAVIGATION_ITEMS, DEFAULT_ACTIVE_ITEM } from "../../constants/navigation.jsx"
import { UserService } from "../../../../shared"

export default function SideBar() {
    const [activeItem, setActiveItem] = useState(DEFAULT_ACTIVE_ITEM)
    const [user] = useState(UserService.getUser())
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const currentPath = location.pathname
        const matchedItem = NAVIGATION_ITEMS.find(item => item.path === currentPath)
        if (matchedItem) {
            setActiveItem(matchedItem.text)
        }
    }, [location.pathname])

    const handleItemClick = (itemText, itemId, path) => {
        setActiveItem(itemText)
        if (path) {
            navigate(path)
        }
        console.log(`切換到頁面: ${itemText} (${itemId})`)
    }

    return (
        <aside className="min-h-full w-60 bg-base-100 border border-base-200" role="navigation" aria-label="主要導航">
            {/* Logo/Brand Section */}
            <div className="flex items-center justify-center p-6 bg-base-100">
                <div className="flex text-3xl font-bold" style={{ fontFamily: 'Roboto Condensed' }}>
                    <span className="text-primary">O</span>
                    <span className="text-base-content">kane</span>
                </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                    {NAVIGATION_GROUPS.map((group, groupIndex) => (
                        <div key={group.title}>
                            <ul className="menu p-4 w-full bg-base-00 text-base-content">
                                <li className="menu-title text-base-content/70">
                                    <span>{group.title}</span>
                                </li>
                                {group.items.map((item) => (
                                    <SideBarItem
                                        key={item.id}
                                        icon={item.icon}
                                        text={item.text}
                                        isFocused={activeItem === item.text}
                                        onClick={() => handleItemClick(item.text, item.id, item.path)}
                                    />
                                ))}
                            </ul>
                            {groupIndex < NAVIGATION_GROUPS.length - 1 && (
                                <div className="divider my-0"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* User Info Section */}
                {user && (
                    <div className="p-4 border-t border-base-300 bg-base-100">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-sm font-medium">
                                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-base-content">
                                    {user.username || 'User'}
                                </span>
                                <span className="text-xs text-base-content/70">
                                    {user.email || ''}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}
