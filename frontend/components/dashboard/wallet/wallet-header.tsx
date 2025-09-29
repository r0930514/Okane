"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  LucideIcon, 
  Wallet as WalletIcon, 
  Banknote, 
  CreditCard, 
  TrendingUp, 
  Bitcoin, 
  Building2, 
  FileText, 
  HandCoins,
  Settings,
  Edit,
  Coins,
  CoinsIcon
} from "lucide-react"
import type { Wallet, WalletType } from "@/lib/types"

interface WalletHeaderProps {
  wallet: Wallet
  onEdit?: () => void
}

// 根據帳戶類型選擇預設圖示
const getDefaultIcon = (walletType?: WalletType): LucideIcon => {
  switch (walletType) {
    case 'cash':
      return Banknote
    case 'bank':
      return Building2
    case 'crypto':
      return Bitcoin
    default:
      return WalletIcon
  }
}

export function WalletHeader({ wallet, onEdit }: WalletHeaderProps) {
  const IconComponent = getDefaultIcon(wallet.type as WalletType)
  
  // 格式化餘額顯示
  const formatBalance = (amount: number, currency: string = 'TWD') => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency === 'TWD' ? 'TWD' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="py-3 border">
      <CardContent className="px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 左側 - 錢包資訊 */}
          <div className="flex items-center space-x-4">
            {/* 錢包圖示 */}
            <div className={cn(
              "w-10 h-10 rounded-lg inline-flex flex-col justify-center items-center",
              "bg-teal-900"
            )}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            
            {/* 錢包名稱和詳情 */}
            <div className="">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl text-gray-900">
                  {wallet.name}
                </h1>
                {wallet.status === 'disabled' && (
                  <Badge className="text-xs bg-red-100 text-red-700">
                    停用
                  </Badge>
                )}
              </div>
              
              {/* 餘額顯示 */}
              <div className="flex items-center space-x-3 mt-1">
                <div className="text-3xl font-semibold text-gray-900">
                  {formatBalance(wallet.balance, wallet.currency)}
                </div>
                <Badge className="text-md bg-white border border-gray-200 text-black">
                  <div className="inline-flex items-center gap-1">
                    <CoinsIcon className="w-4 h-4" />
                    {wallet.currency || '未知'}
                  </div>
                </Badge>
              </div>
            </div>
          </div>
          
          {/* 右側 - 操作按鈕 */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEdit}
              className="flex-1 md:flex-none"
            >
              <Edit className="w-4 h-4 mr-1" />
              編輯
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 md:flex-none"
            >
              <Settings className="w-4 h-4 mr-1" />
              設定
            </Button>
          </div>
        </div>  
      </CardContent>
    </Card>
  )
}