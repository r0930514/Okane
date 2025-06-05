import { Gear, ListMagnifyingGlass, Monitor, Question, Wallet, WaveSawtooth } from "@phosphor-icons/react"
import SideBarItem from "./SideBarItem"
export default function SideBar() {
    return (
        <aside className='bg-base-100 min-h-screen w-60'>
            <div className='navbar justify-start p-4'>
                <li className='flex gap-4 pl-1'>
                    <Wallet className="text-black" size={32} />
                    <a className="text-2xl font-semibold text-black" style={{ fontFamily: 'Roboto Condensed' }}>Okane</a>
                </li>
            </div>
            {/* Sidebar content here */}
            <ul className='menu p-4 w-full bg-base-100 text-base-content gap-1'>
                <SideBarItem
                    icon={<Monitor size={24} />}
                    text="總覽"
                    isFocused={true}
                />
                <SideBarItem
                    icon={<WaveSawtooth size={24} />}
                    text="趨勢圖"
                    isFocused={false}
                />
                <SideBarItem
                    icon={<ListMagnifyingGlass size={24} />}
                    text="所有紀錄"
                    isFocused={false}
                />
                <SideBarItem
                    icon={<Gear size={24} />}
                    text="設定"
                    isFocused={false}
                />
                <SideBarItem
                    icon={<Question size={24} />}
                    text="幫助"
                    isFocused={false}
                />
            </ul>
        </aside>
    )
}