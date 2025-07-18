"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    DollarSign,
    Users,
    CircleDollarSign,
    Plug,
    PieChart,
    TrendingUp,
    Edit3,
    ClipboardList,
    Lock,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "./components/FeatureCard";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FooterSection from "./components/FooterSection";
import StatisticsSection from "./components/StatisticsSection";

function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
            icon: DollarSign,
            title: "多種資產類型",
            description: "支持現金、加密貨幣、股票等多種資產類型管理",
            iconColor: "text-blue-600"
        },
        {
            icon: PieChart,
            title: "智慧分類",
            description: "自動分類管理，讓您的資產組織更有條理",
            iconColor: "text-indigo-600"
        },
        {
            icon: TrendingUp,
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
            icon: CircleDollarSign,
            title: "自訂匯率轉換",
            description: "選擇不同供應商的匯率，獲得最精準的資產價值計算",
            iconColor: "text-purple-600"
        },
        {
            icon: Edit3,
            title: "靈活管理",
            description: "輕鬆新增、編輯和刪除資產，操作簡單直觀",
            iconColor: "text-amber-600"
        },
        {
            icon: ClipboardList,
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
            {/* Navigation Bar */}
            <nav className={`sticky top-0 z-50 px-4 transition-all duration-300 
                ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'backdrop-blur-md' }`}>
                <div className="container mx-auto flex items-center justify-between py-4">

                    {/* Logo */}
                    <div className="flex-none">
                        <Link href="/" className={`text-lg font-bold transition-opacity duration-300 ${
                            isScrolled ? 'opacity-100' : 'opacity-0'
                        }`}>
                            <span className="text-blue-600">O</span>kane
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {/* Desktop Navigation */}
                        <div className={`hidden lg:flex items-center gap-2 transition-opacity duration-300 ${
                            isScrolled ? 'opacity-100' : 'opacity-90'
                        }`}>
                            <button className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2">
                                使用手冊
                            </button>
                            <button className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2">
                                關於我們
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`transition-opacity duration-300 ${
                                    isScrolled ? 'opacity-100' : 'opacity-90'
                                }`}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* CTA Button */}
                        <Link href="/login">
                            <Button 
                                size="sm"
                                className={`transition-all duration-300 ${
                                    isScrolled ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                                }`}
                            >
                                開始使用
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
                        <div className="container mx-auto py-4 space-y-2">
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                使用手冊
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                關於我們
                            </button>
                        </div>
                    </div>
                )}
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
                    <Link href="/login">
                        <Button size="lg" className="px-8 py-3 text-lg">
                            立即開始
                        </Button>
                    </Link>
                </div>

                {/* Demo Image Section */}
                <div className="mb-20 text-center">
                    <div className="max-w-5xl mx-auto">
                        <Image
                            src="/homepage-introdution-1.png"
                            alt="Okane 資產管理系統演示介面"
                            width={1200}
                            height={800}
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
                <Card className="text-center bg-white shadow-xl border border-gray-200">
                    <CardContent className="p-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            準備好開始管理您的資產了嗎？
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            加入 Okane，體驗全新的資產管理方式
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="px-8">
                                    登入｜註冊
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}

export default LandingPage;