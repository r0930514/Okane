"use client"

import { useParams } from "next/navigation"
import { useWalletTransactions } from "@/hooks"
import { WalletTransactionsList, WalletHeader } from "@/components/dashboard/wallet"
import { useWallet } from "@/contexts/WalletContext"

export default function WalletDetailPage() {
  const params = useParams()
  const walletId = params.id as string
  const { wallet } = useWallet() // 從 context 取得錢包資料
  
  const { 
    transactions, 
    loading, 
    error, 
    refetch, 
    stats 
  } = useWalletTransactions(walletId, { 
    allowEmptyOnError: true 
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入交易記錄中...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 錢包標題區域 */}
      <WalletHeader wallet={wallet} />

      {/* 交易記錄區域 */}
      <div>
        <WalletTransactionsList 
          transactions={transactions}
          wallet={wallet}
        />
      </div>

      {/* 錯誤顯示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </>
  )
}