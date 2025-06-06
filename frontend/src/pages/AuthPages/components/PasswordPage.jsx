import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EmailIcon from "../../../assets/svgs/EmailIcon";
import AuthService from "../../../services/AuthService";

export default function PasswordPage({ email }) {
    PasswordPage.propTypes = {
        email: PropTypes.string.isRequired
    }
    
    const nav = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // If email is empty, redirect to login page
    useEffect(() => {
        if (email === '') {
            nav('/login');
        }
    }, [email, nav])

    const handleLogin = async () => {
        setError('');
        
        if (!password.trim()) {
            setError('請輸入密碼');
            return;
        }

        setIsLoading(true);
        try {
            const result = await AuthService.signin(email, password, setIsLoading, nav);
            if (result && result.error) {
                setError(result.error);
            }
        } catch (error) {
            setError('登入失敗，請檢查您的密碼');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="card-body px-6 pt-2 pb-6 space-y-6">
            {/* 頁面標題 */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">歡迎回來！</h2>
                <p className="text-gray-600 text-sm">請輸入您的密碼以登入帳號</p>
            </div>

            {/* 錯誤訊息 */}
            {error && (
                <div className="alert alert-error shadow-lg animate-in slide-in-from-top duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* 表單區域 */}
            <div className="space-y-4">
                {/* Email 顯示 (唯讀) */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-700 font-medium">電子郵件</span>
                    </label>
                    <div className="input input-bordered flex items-center gap-3 bg-gray-50">
                        <EmailIcon className="text-gray-400" />
                        <input 
                            type="email" 
                            className="grow text-gray-600 bg-transparent" 
                            value={email} 
                            disabled 
                        />
                        <div className="badge badge-success badge-sm">已驗證</div>
                    </div>
                </div>

                {/* 密碼輸入框 */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-700 font-medium">密碼</span>
                    </label>
                    <div className={`input input-bordered flex items-center gap-3 transition-all duration-200 ${
                        passwordFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    } ${error && !passwordFocused ? 'border-red-500' : ''}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={`h-4 w-4 transition-colors duration-200 ${
                                passwordFocused ? 'text-blue-500' : 'text-gray-400'
                            }`}>
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="grow text-gray-800 placeholder-gray-400" 
                            placeholder="請輸入您的密碼"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm p-1"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <label className="label">
                        <span></span>
                        <Link to="#" className="label-text-alt link link-hover text-blue-600">
                            忘記密碼？
                        </Link>
                    </label>
                </div>
            </div>

            {/* 按鈕區域 */}
            <div className="space-y-4">
                <button 
                    className={`btn btn-primary w-full text-white font-medium transition-all duration-200 ${
                        isLoading ? 'loading' : 'hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                    onClick={handleLogin}
                    disabled={isLoading || !password.trim()}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            登入中...
                        </>
                    ) : (
                        <>
                            登入
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </>
                    )}
                </button>

                {/* 分隔線 */}
                <div className="divider text-gray-400 text-xs">或使用其他方式</div>

                {/* Passkey 按鈕 */}
                <div className="tooltip w-full" data-tip="通行密鑰功能即將推出">
                    <button className="btn btn-outline w-full gap-2" disabled>
                        <PasskeyIcon />
                        使用通行密鑰登入
                    </button>
                </div>
            </div>

            {/* 底部操作 */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Link to="/login" className="btn btn-ghost btn-sm gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    使用其他帳號
                </Link>
                
                <div className="text-sm text-gray-600">
                    沒有帳號？
                    <Link to="/login/register" className="link link-primary font-medium ml-1">
                        註冊
                    </Link>
                </div>
            </div>
        </div>
    );
}

function PasskeyIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path d="M11 12C9.9 12 8.9625 11.6083 8.1875 10.825C7.4125 10.0417 7.025 9.1 7.025 8C7.025 6.9 7.4125 5.95833 8.1875 5.175C8.9625 4.39167 9.9 4 11 4C12.1 4 13.0417 4.39167 13.825 5.175C14.6083 5.95833 15 6.9 15 8C15 9.1 14.6083 10.0417 13.825 10.825C13.0417 11.6083 12.1 12 11 12ZM17.875 20.55L17.225 19.775C17.1417 19.6917 17.0833 19.5917 17.05 19.475C17.0167 19.3583 17 19.2417 17 19.125V15.825C16.4167 15.6083 15.9375 15.2458 15.5625 14.7375C15.1875 14.2292 15 13.65 15 13C15 12.1667 15.2917 11.4583 15.875 10.875C16.4583 10.2917 17.1667 10 18 10C18.8333 10 19.5417 10.2917 20.125 10.875C20.7083 11.4583 21 12.1667 21 13C21 13.65 20.8125 14.2292 20.4375 14.7375C20.0625 15.2458 19.5833 15.6083 19 15.825V16L19.65 16.65C19.75 16.75 19.8 16.8667 19.8 17C19.8 17.1333 19.75 17.25 19.65 17.35L19 18L19.675 18.65C19.7583 18.7333 19.8042 18.8458 19.8125 18.9875C19.8208 19.1292 19.7833 19.25 19.7 19.35L18.65 20.55C18.55 20.6667 18.4208 20.725 18.2625 20.725C18.1042 20.725 17.975 20.6667 17.875 20.55ZM5 20C4.45 20 3.97917 19.8042 3.5875 19.4125C3.19583 19.0208 3 18.55 3 18V17.225C3 16.6583 3.14167 16.1333 3.425 15.65C3.70833 15.1667 4.1 14.8 4.6 14.55C5.45 14.1167 6.4125 13.75 7.4875 13.45C8.5625 13.15 9.73333 13 11 13C11.35 13 11.6917 13.0125 12.025 13.0375C12.3583 13.0625 12.6917 13.1 13.025 13.15C13.0583 13.9 13.2375 14.6167 13.5625 15.3C13.8875 15.9833 14.3667 16.5417 15 16.975V20H5ZM18 14.5C18.4167 14.5 18.7708 14.3542 19.0625 14.0625C19.3542 13.7708 19.5 13.4167 19.5 13C19.5 12.5833 19.3542 12.2292 19.0625 11.9375C18.7708 11.6458 18.4167 11.5 18 11.5C17.5833 11.5 17.2292 11.6458 16.9375 11.9375C16.6458 12.2292 16.5 12.5833 16.5 13C16.5 13.4167 16.6458 13.7708 16.9375 14.0625C17.2292 14.3542 17.5833 14.5 18 14.5Z" fill="currentColor" />
        </svg>
    );
}
