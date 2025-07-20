"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet as WalletIcon, DollarSign, Calendar } from "lucide-react"
import { useWalletTransactions } from "@/hooks"
import { WalletTransactionsList, WalletBalanceChart, WalletHeader } from "@/components/dashboard/wallet"
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

      {/* 主要內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側 - 錢包餘額圖表 */}
        <div className="lg:col-span-2">
          <WalletBalanceChart 
            wallet={wallet} 
            transactions={transactions}
          />
        </div>
        
        {/* 右側 - 快速統計 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                錢包統計
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">當前餘額</span>
                </div>
                <span className="font-semibold text-lg">
                  {new Intl.NumberFormat('zh-TW', {
                    style: 'currency',
                    currency: wallet.currency || 'TWD'
                  }).format(wallet.balance)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">交易筆數</span>
                </div>
                <span className="font-semibold">
                  {stats.transactionCount} 筆
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <WalletIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">錢包類型</span>
                </div>
                <span className="font-semibold capitalize">
                  {wallet.metadata?.type || '未知'}
                </span>
              </div>

              {/* 新增收支統計 */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">總收入</span>
                  <span className="font-semibold text-green-600">
                    {new Intl.NumberFormat('zh-TW', {
                      style: 'currency',
                      currency: wallet.currency || 'TWD'
                    }).format(stats.totalIncome)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">總支出</span>
                  <span className="font-semibold text-red-600">
                    {new Intl.NumberFormat('zh-TW', {
                      style: 'currency',
                      currency: wallet.currency || 'TWD'
                    }).format(stats.totalExpense)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">淨額</span>
                  <span className={`font-semibold ${
                    stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {new Intl.NumberFormat('zh-TW', {
                      style: 'currency',
                      currency: wallet.currency || 'TWD'
                    }).format(stats.netAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 交易記錄區域 */}
      <div className="mt-4">
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