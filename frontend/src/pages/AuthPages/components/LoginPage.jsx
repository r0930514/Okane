import { XCircle, CaretRight } from "@phosphor-icons/react";
import PropTypes from 'prop-types';
import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import EmailIcon from "../../../assets/svgs/EmailIcon";
import PasskeyIcon from "../../../assets/svgs/PasskeyIcon";

export default function LoginPage({ email, setEmail }) {
    LoginPage.propTypes = {
        email: PropTypes.string.isRequired,
        setEmail: PropTypes.func.isRequired
    };
    
    const {
        isLoading,
        error,
        clearError,
        verifyEmailAndNavigate,
        checkTokenAndNavigate
    } = useAuth();

    const {
        validateEmailWithError,
        createKeyPressHandler
    } = useAuthForm();

    useEffect(() => {
        checkTokenAndNavigate();
    }, [checkTokenAndNavigate])

    // 處理點擊繼續的事件
    const handleContinue = async () => {
        // 清除之前的錯誤
        clearError();
        
        // 驗證 email 格式
        if (!validateEmailWithError(email)) {
            return;
        }

        // 驗證 email 並導航到對應頁面
        await verifyEmailAndNavigate(email);
    };

    // 處理鍵盤按鍵事件，當按下 Enter 鍵時觸發繼續操作
    const handleKeyPress = createKeyPressHandler(handleContinue);

    return (
        <div className="card-body px-6 pt-2 pb-6 space-y-4">
            {/* 頁面標題 */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">開始使用 Okane</h2>
                <p className="text-gray-600 text-sm">請輸入您的電子郵件地址以繼續</p>
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
                {/* Email 輸入框 */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-700 font-medium">電子郵件</span>
                    </label>
                    <div className={`input input-bordered flex items-center gap-3 
                        ${ error ? 'input-error' : ''}`
                    }>
                        <EmailIcon />
                        <input 
                            type="email" 
                            className="grow text-gray-800 placeholder-gray-400" 
                            placeholder="請輸入您的電子郵件"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                        />
                    </div>
                    <label className="label">
                        <span className="label-text-alt text-gray-500">
                            我們將檢查此電子郵件是否已註冊
                        </span>
                    </label>
                </div>
            </div>

            {/* 按鈕區域 */}
            <div className="space-y-4">
                <button 
                    className={`btn btn-primary w-full text-white font-medium transition-all duration-200 `}
                    onClick={handleContinue}
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

                {/* 使用 Passkey 登入  */}
                <div className="tooltip w-full" data-tip="通行密鑰功能即將推出">
                    <button className="btn btn-outline w-full gap-2" disabled>
                        <PasskeyIcon />
                        使用通行密鑰登入
                    </button>
                </div>
            </div>

            {/* 說明文字 */}
            <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-xs leading-relaxed">
                    繼續即表示您同意我們的
                    <span> </span>
                    <span className="link link-primary">服務條款</span> 和 
                    <span> </span>
                    <span className="link link-primary">隱私政策</span>
                </p>
            </div>
        </div>
    );
}
