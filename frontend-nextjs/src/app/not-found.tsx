"use client";

import Link from "next/link";
import { ChartPieIcon } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-indigo-100 flex flex-col">
            {/* 簡化的導航列 */}
            <nav className="navbar px-4">
                <div className="container mx-auto">
                    <div className="flex-none">
                        <Link href="/" className="btn btn-ghost text-lg font-bold normal-case gap-0">
                            <span className="text-blue-600">O</span>kane
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 主要內容區域 */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl w-full text-center">
                    {/* 404 圖片 */}
                    <div className="mb-8">
                        <div className="relative mx-auto w-full max-w-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png?raw=true" 
                                alt="404 Not Found" 
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    {/* 錯誤訊息 */}
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                            找不到頁面
                        </h2>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            抱歉，您要訪問的頁面可能已經移動或不存在。讓我們幫您回到正確的地方。
                        </p>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/">
                            <button className="btn btn-primary btn-lg gap-2 px-6">
                                返回首頁
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="btn btn-outline btn-lg gap-2 px-6">
                                <ChartPieIcon className="w-5 h-5" />
                                前往儀表板
                            </button>
                        </Link>
                    </div>

                    {/* 額外的幫助連結 */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            需要幫助嗎？
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center text-sm">
                            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                                聯繫支援
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                                使用手冊
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                                回報問題
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 簡化的頁腳 */}
            <footer className="py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">
                        © 2025 <span className="text-blue-600 font-semibold">Okane</span>. 
                        讓資產管理變得更簡單。
                    </p>
                </div>
            </footer>
        </div>
    );
}