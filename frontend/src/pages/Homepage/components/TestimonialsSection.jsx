export default function TestimonialsSection() {
    return (
        <div>
            <div id="testimonials" className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">用戶怎麼說</h2>
                    <p className="text-xl text-gray-600">來看看其他用戶的使用體驗</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-bold">A</span>
                            </div>
                            <div>
                                <h4 className="font-semibold">Alex Chen</h4>
                                <p className="text-gray-500 text-sm">軟體工程師</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Okane 讓我的投資組合管理變得超級簡單，介面直觀易用，強烈推薦！
                        </p>
                        <div className="flex text-yellow-400">
                            {"★".repeat(5)}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-green-600 font-bold">M</span>
                            </div>
                            <div>
                                <h4 className="font-semibold">Maria Wang</h4>
                                <p className="text-gray-500 text-sm">財務顧問</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                            分帳功能太棒了！和朋友出遊再也不用擔心算錢的問題。
                        </p>
                        <div className="flex text-yellow-400">
                            {"★".repeat(5)}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-purple-600 font-bold">J</span>
                            </div>
                            <div>
                                <h4 className="font-semibold">John Liu</h4>
                                <p className="text-gray-500 text-sm">創業家</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                            多幣種支援和即時匯率轉換功能對我的國際業務非常有幫助。
                        </p>
                        <div className="flex text-yellow-400">
                            {"★".repeat(5)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}