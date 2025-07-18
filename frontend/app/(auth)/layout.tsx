import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-blue-600">O</span>kane
          </h1>
          <p className="text-gray-600">資產管理系統</p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="px-8 py-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}