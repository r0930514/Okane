import { List, Plus, ArrowsClockwise, UserCircle } from "@phosphor-icons/react"
// import AuthService from "../../../services/AuthService";

export default function NavBar(nav, username) {
    return (
        <nav className="navbar w-full shadow-sm">
            <div className="flex-none">
                <label htmlFor="drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
                    <List size={24} />
                </label>
            </div>
            <div className="flex-1 ">
                <a className="btn btn-ghost text-xl hidden">Okane</a>
            </div>
            <div className="flex-none pr-2 gap-2">
                <button className="btn btn-ghost">
                    <UserCircle size={24} />
                    <p className="hidden lg:flex"> {username} </p>
                    {/* <button className="btn btn-ghost" onClick={
                    () => {
                        AuthService.logout();
                        nav('/');
                    }
                    }>登出</button> */}
                </button>
                <button className="btn btn-ghost btn-square">
                    <ArrowsClockwise size={24} />
                </button>
                <button className="btn btn-ghost btn-square">
                    <Plus size={24} ></Plus>
                </button>

            </div>
            <div className="divider"></div>
        </nav>
    )
}