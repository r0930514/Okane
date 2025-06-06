export default function StatisticsSection() {
    return (
        <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-3xl font-bold text-blue-600 mb-2">等你來</div>
                    <div className="text-gray-600">活躍用戶</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                    <div className="text-gray-600">管理資產</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Beta</div>
                    <div className="text-gray-600">系統穩定性</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-3xl font-bold text-orange-600 mb-2">1/24</div>
                    <div className="text-gray-600">全天候服務</div>
                </div>
            </div>
        </div>
    )

}