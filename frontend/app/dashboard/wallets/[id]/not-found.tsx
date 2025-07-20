import { AppSidebar } from "@/components/dashboard/layout/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WalletNotFound() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 px-8 py-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  錢包不存在
                </h1>
                <p className="text-gray-600 mb-6">
                  抱歉，找不到您要查看的錢包。錢包可能已被刪除或您沒有存取權限。
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回儀表板
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-500">
                    如果您認為這是錯誤，請聯繫系統管理員
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}