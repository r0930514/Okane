"use client"

import { WalletCard } from "@/components/dashboard/wallet-card"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon, Loader2, RefreshCw } from "lucide-react"
import { useWalletsList } from "@/hooks"
import type { WalletType } from "@/lib/types"

export function WalletsSection() {
  const { 
    wallets, 
    loading, 
    error, 
    refetch, 
    stats 
  } = useWalletsList({ 
    allowEmptyOnError: true 
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">錢包</h2>
          {stats.totalWallets > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              共 {stats.totalWallets} 個錢包，{stats.activeWallets} 個啟用
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={refetch}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重新載入
            </Button>
          )}
          <Button variant="outline" size="sm">
            <PanelLeftIcon className="mr-2 h-4 w-4" />
            新增錢包
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">載入中...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refetch}
            >
              重試
            </Button>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              id={wallet.id}
              name={wallet.name}
              balance={wallet.balance}
              currency={wallet.currency || 'TWD'}
              walletType={wallet.type as WalletType}
              color={'bg-teal-900'}
            />
          ))}
          
          {wallets.length === 0 && !error && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">尚未建立任何錢包</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}