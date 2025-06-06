import { Route, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import PasswordPage from "../components/PasswordPage";
import { useState } from "react";

export default function AuthPage() {
    const [email, setEmail] = useState('');
    
    return (
        <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-4 sm:py-8">
            {/* 背景裝飾元素 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-10"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full opacity-10 " ></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-400 rounded-full opacity-5"></div>
            </div>
            
            {/* 主要卡片容器 */}
            <div className="relative w-full max-w-md">
                <div className="card bg-base-100 glass-effect shadow-md transition-all">
                    {/* Logo 和標題區域 */}
                    <figure className='flex flex-col items-center px-8 pt-8 pb-4'>
                        <h1 className="text-3xl font-bold gradient-text mt-3">
                            <span className="text-blue-600">O</span>kane
                        </h1>
                    </figure>
                    
                    {/* 路由內容區域 */}
                    <div className="px-2">
                        <Routes>
                            <Route index element={<LoginPage setEmail={setEmail} email={email} />} />
                            <Route path="register" element={<RegisterPage email={email} />} />
                            <Route path="password" element={<PasswordPage email={email} />} />
                        </Routes>
                    </div>
                </div>
                
                {/* 底部附加資訊 */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p className="hover:text-gray-700">
                        © 2025 Okane.
                    </p>
                </div>
            </div>
            
        </div>
    )
}
