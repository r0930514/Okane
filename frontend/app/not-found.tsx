import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, BarChart3, HelpCircle, BookOpen, AlertCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - 找不到頁面 | Okane",
    description: "抱歉，您要訪問的頁面可能已經移動或不存在。",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
            {/* 簡化的導航列 */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <span className="text-xl font-bold">
                                <span className="text-blue-600">O</span>kane
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 主要內容區域 */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-2xl w-full text-center">
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="p-0">
                            {/* 404 圖片區域 */}
                            <div className="mb-8">
                                <div className="relative mx-auto w-full max-w-lg">
                                    <Image
                                        src="/404-NotFound.png"
                                        alt="404 Not Found"
                                        width={500}
                                        height={300}
                                        className="w-full h-auto rounded-lg"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* 錯誤訊息 */}
                            <div className="mb-8 space-y-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                    找不到頁面
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                                    抱歉，您要訪問的頁面可能已經移動或不存在 (｡•́︿•̀｡)
                                </p>
                            </div>

                            {/* 操作按鈕 */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/">
                                        <Home className="w-4 h-4" />
                                        返回首頁
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="gap-2">
                                    <Link href="/dashboard">
                                        <BarChart3 className="w-4 h-4" />
                                        前往儀表板
                                    </Link>
                                </Button>
                            </div>

                            {/* 額外的幫助連結 */}
                            <div className="pt-8 border-t border-border">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">需要幫助嗎？</span>
                                </div>
                                <div className="flex flex-wrap gap-6 justify-center text-sm">
                                    <Link 
                                        href="/" 
                                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        聯繫支援
                                    </Link>
                                    <Link 
                                        href="/" 
                                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                    >
                                        <BookOpen className="w-3 h-3" />
                                        使用手冊
                                    </Link>
                                    <Link 
                                        href="/" 
                                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        回報問題
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 簡化的頁腳 */}
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2025 <span className="text-primary font-semibold">Okane</span>. 
                        讓資產管理變得更簡單。
                    </p>
                </div>
            </footer>
        </div>
    );
}
