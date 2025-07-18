import { Card, CardContent } from '@/components/ui/card';

export default function StatisticsSection() {
    return (
        <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">等你來</div>
                        <div className="text-gray-600">活躍用戶</div>
                    </CardContent>
                </Card>
                <Card className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                        <div className="text-gray-600">管理資產</div>
                    </CardContent>
                </Card>
                <Card className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-purple-600 mb-2">Beta</div>
                        <div className="text-gray-600">系統穩定性</div>
                    </CardContent>
                </Card>
                <Card className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-orange-600 mb-2">1/24</div>
                        <div className="text-gray-600">全天候服務</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}