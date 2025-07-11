import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '登入 • Okane',
    description: '登入您的 Okane 帳號以管理您的資產',
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* 品牌標誌區域 */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2">Okane</h1>
                        <p className="text-gray-600">您的個人資產管理助手</p>
                    </div>

                    {/* 認證卡片 */}
                    <div className="card bg-base-100 shadow-xl border border-gray-200 pt-5">
                        {children}
                    </div>

                    {/* 底部連結 */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>
                            遇到問題？ 
                            <a href="#" className="link link-primary ml-1">
                                聯絡客服
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}