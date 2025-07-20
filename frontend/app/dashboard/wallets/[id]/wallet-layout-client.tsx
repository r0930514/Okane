"use client"

import { useParams, useRouter } from "next/navigation"
import { useWalletDetail } from "@/hooks"
import { WalletProvider } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"

interface WalletLayoutClientProps {
  children: React.ReactNode
}

export function WalletLayoutClient({ children }: WalletLayoutClientProps) {
  const params = useParams()
  const router = useRouter()
  const walletId = params.id as string
  
  const { wallet, loading, error, refetch } = useWalletDetail(walletId)

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-8 py-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入錢包資訊中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-8 py-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || '錢包不存在'}</p>
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/dashboard')}
              className="mr-2"
            >
              返回儀表板
            </Button>
            <Button
              variant="outline"
              onClick={refetch}
            >
              重新載入
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WalletProvider wallet={wallet}>
      <div className="flex flex-1 flex-col gap-4 px-8 py-4">
        {children}
      </div>
    </WalletProvider>
  )
}