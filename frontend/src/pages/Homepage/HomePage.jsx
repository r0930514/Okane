import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    CurrencyDollar,
    Users,
    CurrencyCircleDollar,
    Plug,
    ChartPie,
    TrendUp,
    PencilSimple,
    ClipboardText,
    Lock,
} from "@phosphor-icons/react";
import FeatureCard from "./components/FeatureCard";
import demoImage from "../../assets/homepage-introdution-1.png";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FooterSection from "./components/FooterSection";
import StatisticsSection from "./components/StatisticsSection";

function HomePage() {
    const [isScrolled, setIsScrolled] = useState(false);
    // Handle scroll event to change navbar style
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const features = [
        {
            icon: CurrencyDollar,
            title: "多種資產類型",
            description: "支持現金、加密貨幣、股票等多種資產類型管理",
            iconColor: "text-blue-600"
        },
        {
            icon: ChartPie,
            title: "智慧分類",
            description: "自動分類管理，讓您的資產組織更有條理",
            iconColor: "text-indigo-600"
        },
        {
            icon: TrendUp,
            title: "資產總值計算",
            description: "即時計算資產總值，掌握財務狀況",
            iconColor: "text-emerald-600"
        },
        {
            icon: Plug,
            title: "智慧錢包",
            description: "自動更新資產資訊，並且有多個不同模組可供選擇",
            iconColor: "text-orange-600"
        },
        {
            icon: Users,
            title: "朋友分帳",
            description: "與朋友輕鬆分帳，再也不擔心出去玩算錢的麻煩",
            iconColor: "text-green-600"
        },
        {
            icon: CurrencyCircleDollar,
            title: "自訂匯率轉換",
            description: "選擇不同供應商的匯率，獲得最精準的資產價值計算",
            iconColor: "text-purple-600"
        },
        {
            icon: PencilSimple,
            title: "靈活管理",
            description: "輕鬆新增、編輯和刪除資產，操作簡單直觀",
            iconColor: "text-amber-600"
        },
        {
            icon: ClipboardText,
            title: "專業報告",
            description: "生成詳細報告，分析資產分佈和變化趨勢",
            iconColor: "text-teal-600"
        },
        {
            icon: Lock,
            title: "安全可靠",
            description: "採用安全的身份驗證，保護您的財務隱私",
            iconColor: "text-red-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-indigo-100">
            {/* Navigation Bar */}
            <nav className={`navbar sticky top-0 z-50 px-4 transition-all duration-300 
                ${isScrolled? 'bg-white shadow-lg backdrop-blur-sm' : 'base-200 backdrop-blur-sm ' }`}>
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-none">
                        <Link to="/" className={`btn btn-ghost text-lg font-bold normal-case gap-0 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'
                        }`}>
                            <span className="text-blue-600">O</span>kane
                        </Link>
                    </div>
                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {/* Desktop Navigation */}
                        <ul className={
                            `menu menu-horizontal px-1 hidden lg:flex items-center transition-opacity duration-300 
                            ${isScrolled ? 'opacity-100' : 'opacity-90' }`}>
                            <li><button className="hover:text-blue-600 transition-colors duration-200 px-3 py-2">使用手冊</button></li>
                        </ul>
                        <ul className={
                            `menu menu-horizontal px-1 hidden lg:flex items-center transition-opacity duration-300 
                            ${isScrolled ? 'opacity-100' : 'opacity-90' }`}>
                            <li><button className="hover:text-blue-600 transition-colors duration-200 px-3 py-2">關於我們</button></li>
                        </ul>
                        {/* Mobile Dropdown Menu */}
                        <div className={`dropdown dropdown-end lg:hidden transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-90'
                        }`}>
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <button>使用手冊</button></li>
                                <li><button>關於我們</button></li>
                            </ul>
                        </div>
                        <Link to={'/login'}>
                            <button className={`btn btn-sm transition-all duration-300 ${isScrolled ? 'opacity-100 scale-100 btn-primary' : 'opacity-90 scale-95 btn-ghost'
                            }`}>
                                開始使用
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-gray-800 mb-6">
                        <span className="text-blue-600">O</span>kane
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        輕鬆管理和追蹤您的資產，讓理財變得更簡單直觀
                    </p>
                    <Link to={'/login'}>
                        <button className="btn btn-primary btn-lg px-8 py-3 text-lg">
                            立即開始
                        </button>
                    </Link>
                </div>

                {/* Demo Image Section */}
                <div className="mb-20 text-center">
                    <div className="max-w-5xl mx-auto">
                        <img
                            src={demoImage}
                            alt="Okane 資產管理系統演示介面"
                            className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow duration-500"
                        />
                    </div>
                </div>

                {/* Statistics Section */}
                <StatisticsSection />

                {/* Features Section */}
                <div id="features" className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">強大功能特色</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            我們提供全方位的資產管理解決方案，讓您輕鬆掌控財務狀況
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                iconColor={feature.iconColor}
                            />
                        ))}
                    </div>
                </div>

                {/* Testimonials Section */}
                <TestimonialsSection />
                {/* Help Center / FAQ Section */}
                <FAQSection />

                {/* CTA Section */}
                <div className="text-center bg-white rounded-2xl shadow-xl p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        準備好開始管理您的資產了嗎？
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        加入 Okane，體驗全新的資產管理方式
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={'/login'}>
                            <button className="btn btn-primary btn-lg px-8">
                                登入｜註冊
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}

export default HomePage;