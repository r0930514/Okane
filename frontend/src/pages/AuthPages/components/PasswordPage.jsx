import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import EmailIcon from "../../../assets/svgs/email";
import { useEffect } from "react";
import AuthService from "../../../services/AuthService";

export default function PasswordPage({ email }) {
    PasswordPage.propTypes = {
        email: PropTypes.string.isRequired
    }
    const nav = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If email is empty, redirect to login page
    useEffect(()=>{
        if (email === '') {
            nav('/login');
        }
    }, [email, nav])

    return <div className="card-body w-full pt-4 space-y-4 ">
        <div className='flex items-center gap-3 justify-center'>
            <div className="flex flex-col gap-6 w-screen xl:w-10/12">
                {/* Username Input Field */}
                <label className="input input-bordered flex items-center gap-2" >
                    <EmailIcon />
                    <input type="text" className="grow" placeholder="Email" value={email} disabled />
                </label>
                {/* Password Input Field */}
                <label className="transition-all duration-500 ease-out input input-bordered flex items-center gap-2  ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input type="password" className="grow" placeholder="密碼" value={password} onChange={
                        (e) => setPassword(e.target.value) 
                    } />
                </label>
            </div>

        </div>

        <div className="card-actions justify-center gap-4">
            <Link to="/login">
                <button className="btn btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </Link>
            <button className="btn" onClick={() => {
                AuthService.signin(email, password, setIsLoading, nav)
            }}>
                {isLoading ? <span className="loading loading-spinner"></span> : '登入'}
            </button>
            {/* Passkey Btn */}
            <div className="tooltip" data-tip="❌使用通行密鑰登入">
                <button className="btn btn-primary px-3">
                    {PasskeyIcon()}
                </button>
            </div>
        </div>
    </div>;

    function PasskeyIcon() {
        return <svg className="h-6 w-6" fill="none">
            <path d="M11 12C9.9 12 8.9625 11.6083 8.1875 10.825C7.4125 10.0417 7.025 9.1 7.025 8C7.025 6.9 7.4125 5.95833 8.1875 5.175C8.9625 4.39167 9.9 4 11 4C12.1 4 13.0417 4.39167 13.825 5.175C14.6083 5.95833 15 6.9 15 8C15 9.1 14.6083 10.0417 13.825 10.825C13.0417 11.6083 12.1 12 11 12ZM17.875 20.55L17.225 19.775C17.1417 19.6917 17.0833 19.5917 17.05 19.475C17.0167 19.3583 17 19.2417 17 19.125V15.825C16.4167 15.6083 15.9375 15.2458 15.5625 14.7375C15.1875 14.2292 15 13.65 15 13C15 12.1667 15.2917 11.4583 15.875 10.875C16.4583 10.2917 17.1667 10 18 10C18.8333 10 19.5417 10.2917 20.125 10.875C20.7083 11.4583 21 12.1667 21 13C21 13.65 20.8125 14.2292 20.4375 14.7375C20.0625 15.2458 19.5833 15.6083 19 15.825V16L19.65 16.65C19.75 16.75 19.8 16.8667 19.8 17C19.8 17.1333 19.75 17.25 19.65 17.35L19 18L19.675 18.65C19.7583 18.7333 19.8042 18.8458 19.8125 18.9875C19.8208 19.1292 19.7833 19.25 19.7 19.35L18.65 20.55C18.55 20.6667 18.4208 20.725 18.2625 20.725C18.1042 20.725 17.975 20.6667 17.875 20.55ZM5 20C4.45 20 3.97917 19.8042 3.5875 19.4125C3.19583 19.0208 3 18.55 3 18V17.225C3 16.6583 3.14167 16.1333 3.425 15.65C3.70833 15.1667 4.1 14.8 4.6 14.55C5.45 14.1167 6.4125 13.75 7.4875 13.45C8.5625 13.15 9.73333 13 11 13C11.35 13 11.6917 13.0125 12.025 13.0375C12.3583 13.0625 12.6917 13.1 13.025 13.15C13.0583 13.9 13.2375 14.6167 13.5625 15.3C13.8875 15.9833 14.3667 16.5417 15 16.975V20H5ZM18 14.5C18.4167 14.5 18.7708 14.3542 19.0625 14.0625C19.3542 13.7708 19.5 13.4167 19.5 13C19.5 12.5833 19.3542 12.2292 19.0625 11.9375C18.7708 11.6458 18.4167 11.5 18 11.5C17.5833 11.5 17.2292 11.6458 16.9375 11.9375C16.6458 12.2292 16.5 12.5833 16.5 13C16.5 13.4167 16.6458 13.7708 16.9375 14.0625C17.2292 14.3542 17.5833 14.5 18 14.5Z" fill="white" />
        </svg>;
    }
}