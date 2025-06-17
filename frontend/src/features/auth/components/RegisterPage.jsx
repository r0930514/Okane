import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { XCircle, Eye, EyeClosed } from "@phosphor-icons/react";
import EmailIcon from "../../../assets/svgs/EmailIcon";
import PasswordIcon from "../../../assets/svgs/PasswordIcon";
import { useAuth } from "../hooks/useAuth";
import { useAuthForm } from "../hooks/useAuthForm";

export default function RegisterPage({ email }) {
    RegisterPage.propTypes = {
        email: PropTypes.string.isRequired
    }
    
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const {
        isLoading,
        error,
        handleError,
        signupAndNavigate
    } = useAuth();

    const {
        validateUsername,
        createKeyPressHandler
    } = useAuthForm();

    // If email is empty, redirect to login page
    useEffect(() => {
        if (email === '') {
            nav('/login');
        }
    }, [email, nav])

    const handleRegister = async () => {
        // 驗證輸入
        if (!username.trim()) {
            handleError('請輸入使用者名稱');
            return;
        }

        const usernameError = validateUsername(username);
        if (usernameError) {
            handleError(usernameError);
            return;
        }

        if (!password.trim()) {
            handleError('請輸入密碼');
            return;
        }

        if (password.length < 6) {
            handleError('密碼長度至少需要 6 個字元');
            return;
        }

        if (password !== confirmPassword) {
            handleError('密碼確認不一致');
            return;
        }

        // 使用新的 useAuth hook 進行註冊
        await signupAndNavigate(email, password, username);
    };

    return (
        <div className="card-body px-6 pt-2 pb-6 space-y-6">
            {/* 頁面標題 */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">建立您的帳號</h2>
                <p className="text-gray-600 text-sm">請填寫以下資訊來註冊您的 Okane 帳號</p>
            </div>

            {/* 成功提示 */}
            <div className="alert alert-info shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">此電子郵件尚未註冊，請完成註冊程序</span>
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
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">電子郵件</legend>
                        <label className="input w-full">
                            <EmailIcon className="h-5 w-5 text-gray-500" />
                            <input 
                                type="email" 
                                className="grow" 
                                value={email} 
                                disabled 
                            />
                            <div className="badge badge-info badge-sm">新用戶</div>
                        </label>
                        <p className="label">新用戶電子郵件地址</p>
                    </fieldset>
                </div>

                {/* 使用者名稱輸入框 */}
                <div className="form-control">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">使用者名稱</legend>
                        <label className="input w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input 
                                type="text" 
                                required
                                className="grow" 
                                placeholder="請輸入使用者名稱"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={createKeyPressHandler(handleRegister)}
                                disabled={isLoading}
                            />
                        </label>
                        <p className="label">2-20 個字元，將顯示為您的帳號名稱</p>
                    </fieldset>
                </div>

                {/* 密碼輸入框 */}
                <div className="form-control">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">密碼</legend>
                        <label className="input w-full">
                            <PasswordIcon className="h-5 w-5 text-gray-500" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                className="grow" 
                                placeholder="請輸入密碼"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={createKeyPressHandler(handleRegister)}
                                disabled={isLoading}
                            />
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
                        </label>
                        <p className="label">至少 6 個字元</p>
                    </fieldset>
                </div>

                {/* 確認密碼輸入框 */}
                <div className="form-control">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">確認密碼</legend>
                        <label className="input w-full">
                            <PasswordIcon className="h-5 w-5 text-gray-500" />
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                required
                                className="grow" 
                                placeholder="請再次輸入密碼"
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={createKeyPressHandler(handleRegister)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm p-1"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeClosed className="h-4 w-4" size={24} weight="bold" />
                                ) : (
                                    <Eye className="h-4 w-4" size={24} weight="bold" />
                                )}
                            </button>
                            {password && confirmPassword && password === confirmPassword && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </label>
                        <p className="label">請確認兩次密碼輸入一致</p>
                    </fieldset>
                </div>
            </div>

            {/* 按鈕區域 */}
            <div className="space-y-4">
                <button 
                    className={`btn btn-primary w-full text-white font-medium transition-all duration-200 
                    }`}
                    onClick={handleRegister}
                    disabled={isLoading || !username.trim() || !password.trim() || !confirmPassword.trim()}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            註冊中...
                        </>
                    ) : (
                        <>
                            建立帳號
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            {/* 底部操作 */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Link to="/login" className="btn btn-ghost btn-sm gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    使用其他帳號
                </Link>
            </div>

            {/* 條款說明 */}
            <div className="text-center pt-2">
                <p className="text-gray-600 text-xs leading-relaxed">
                    註冊即表示您同意我們的
                    <span className="link link-primary">服務條款</span> 和 
                    <span className="link link-primary">隱私政策</span>
                </p>
            </div>
        </div>
    );
}
