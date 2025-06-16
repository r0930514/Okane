import { Gear, ListMagnifyingGlass, Monitor, Question, WaveSawtooth } from "@phosphor-icons/react"
import { useState } from "react"
import SideBarItem from "./SideBarItem"

export default function SideBar() {
    const [activeItem, setActiveItem] = useState("總覽")

    const menuItems = [
        {
            icon: <Monitor size={24} />,
            text: "總覽",
            id: "overview"
        },
        {
            icon: <WaveSawtooth size={24} />,
            text: "趨勢圖",
            id: "trends"
        },
        {
            icon: <ListMagnifyingGlass size={24} />,
            text: "所有紀錄",
            id: "records"
        },
        {
            icon: <Gear size={24} />,
            text: "設定",
            id: "settings"
        },
        {
            icon: <Question size={24} />,
            text: "幫助",
            id: "help"
        }
    ]

    const handleItemClick = (itemText, itemId) => {
        setActiveItem(itemText)
        console.log(`切換到頁面: ${itemText} (${itemId})`)
        // 這裡之後可以添加路由導航邏輯
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
                {menuItems.map((item) => (
                    <SideBarItem
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                        isFocused={activeItem === item.text}
                        onClick={() => handleItemClick(item.text, item.id)}
                    />
                ))}
            </ul>
        </aside>
    )
}
