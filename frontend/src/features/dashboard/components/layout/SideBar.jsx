import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import SideBarItem from "./SideBarItem"
import { NAVIGATION_ITEMS, DEFAULT_ACTIVE_ITEM } from "../../constants/navigation.jsx"

export default function SideBar() {
    const [activeItem, setActiveItem] = useState(DEFAULT_ACTIVE_ITEM)
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
        <aside className='bg-base-100 min-h-screen w-60'>
            <div className='navbar w-full justify-start p-4'>
                <div className='flex w-full justify-center text-3xl font-bold normal-case gap-0 pl-1' style={{ fontFamily: 'Roboto Condensed' }}>
                    <span className="text-blue-600">O</span>kane
                </div>
            </div>
            {/* Sidebar content here */}
            <ul className='menu p-4 w-full bg-base-100 text-base-content gap-2'>
                {NAVIGATION_ITEMS.map((item) => (
                    <SideBarItem
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                        isFocused={activeItem === item.text}
                        onClick={() => handleItemClick(item.text, item.id, item.path)}
                    />
                ))}
            </ul>
        </aside>
    )
}
