import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CaretRight, XCircle, Eye, EyeClosed, CaretLeft } from "@phosphor-icons/react";
import EmailIcon from "../../../assets/svgs/EmailIcon";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import PasskeyIcon from "../../../assets/svgs/PasskeyIcon";
import PasswordIcon from "../../../assets/svgs/PasswordIcon";

export default function PasswordPage({ email }) {
    PasswordPage.propTypes = {
        email: PropTypes.string.isRequired
    }
    
    const nav = useNavigate();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const {
        isLoading,
        error,
        handleError,
        signinAndNavigate
    } = useAuth();

    const {
        createKeyPressHandler
    } = useAuthForm();

    // If email is empty, redirect to login page
    useEffect(() => {
        if (email === '') {
            nav('/login');
        }
    }, [email, nav])

    const handleLogin = async () => {
        if (!password.trim()) {
            handleError('請輸入密碼');
            return;
        }

        // 使用新的 useAuth hook 進行登入
        await signinAndNavigate(email, password);
    };

    return (
        <div className="card-body px-6 pt-2 pb-6 space-y-4">
            {/* 頁面標題 */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">歡迎回來！</h2>
                <p className="text-gray-600 text-sm">請輸入您的密碼以登入帳號</p>
            </div>

            {/* 錯誤訊息 */}
            {error && (
                <div className="alert alert-error shadow-lg animate-in slide-in-from-top duration-300">
                    <XCircle className="shrink-0 h-6 w-6" />
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
                        <div className="badge badge-success badge-sm"></div>
                    </div>
                </div>

                {/* 密碼輸入框 */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-700 font-medium">密碼</span>
                    </label>
                    <div className={`input input-bordered flex items-center gap-3 transition-all duration-200  
                      ${error ? 'input-error' : ''}`}>
                        <PasswordIcon />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="grow text-gray-800 placeholder-gray-400" 
                            placeholder="請輸入您的密碼"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={createKeyPressHandler(handleLogin)}
                            disabled={isLoading}
                        />
                        {/* 密碼可見性切換按鈕 */}
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm p-1"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeClosed className="h-4 w-4" size={24} weight="bold" />
                            ) : (
                                <Eye className="h-4 w-4" size={24} weight="bold" />
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
                    className={`btn btn-primary w-full text-white font-medium transition-all duration-200 `}
                    onClick={handleLogin}
                    disabled={isLoading || !email.trim()}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            檢查中...
                        </>
                    ) : (
                        <>
                            繼續
                            <CaretRight weight="bold" className="h-4 w-4 ml-2" />
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
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <Link to="/login" className="btn btn-ghost btn-sm gap-2">
                    <CaretLeft weight="bold" className="h-4 w-4" />
                    使用其他帳號
                </Link>
                
            </div>
        </div>
    );
}
