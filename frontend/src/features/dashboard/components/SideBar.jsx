import { Gear, ListMagnifyingGlass, Monitor, Question, WaveSawtooth, Wallet, Receipt } from "@phosphor-icons/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SideBarItem from "./SideBarItem"

export default function SideBar() {
    const [activeItem, setActiveItem] = useState("總覽")
    const navigate = useNavigate()

    const menuItems = [
        {
            icon: <Monitor size={24} />,
            text: "總覽",
            id: "overview",
            path: "/dashboard"
        },
        {
            icon: <Wallet size={24} />,
            text: "錢包管理",
            id: "wallets",
            path: "/wallets"
        },
        {
            icon: <Receipt size={24} />,
            text: "交易管理",
            id: "transactions",
            path: "/transactions"
        },
        {
            icon: <WaveSawtooth size={24} />,
            text: "趨勢圖",
            id: "trends",
            path: "/trends"
        },
        {
            icon: <ListMagnifyingGlass size={24} />,
            text: "所有紀錄",
            id: "records",
            path: "/records"
        },
        {
            icon: <Gear size={24} />,
            text: "設定",
            id: "settings",
            path: "/settings"
        },
        {
            icon: <Question size={24} />,
            text: "幫助",
            id: "help",
            path: "/help"
        }
    ]

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
                {menuItems.map((item) => (
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
