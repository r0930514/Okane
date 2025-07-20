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
  Edit
} from "lucide-react"
import type { Wallet, WalletType } from "@/lib/types"

interface WalletHeaderProps {
  wallet: Wallet
  onEdit?: () => void
}

// 根據錢包類型選擇預設圖示
const getDefaultIcon = (walletType?: WalletType): LucideIcon => {
  switch (walletType) {
    case 'cash':
      return Banknote
    case 'bank':
      return Building2
    case 'card':
      return CreditCard
    case 'stock':
    case 'foreign_stock':
      return TrendingUp
    case 'crypto':
      return Bitcoin
    case 'receivable':
      return FileText
    case 'payable':
      return HandCoins
    default:
      return WalletIcon
  }
}

// 錢包類型顯示名稱
const getWalletTypeDisplay = (walletType?: WalletType): string => {
  switch (walletType) {
    case 'cash':
      return '現金'
    case 'bank':
      return '銀行帳戶'
    case 'card':
      return '信用卡'
    case 'stock':
      return '股票'
    case 'foreign_stock':
      return '外國股票'
    case 'crypto':
      return '加密貨幣'
    case 'receivable':
      return '應收帳款'
    case 'payable':
      return '應付帳款'
    default:
      return '未知類型'
  }
}

// 根據錢包類型獲取狀態顏色
const getStatusColor = (walletType?: WalletType, isActive?: boolean) => {
  if (!isActive) return 'bg-gray-100 text-gray-600'
  
  switch (walletType) {
    case 'cash':
      return 'bg-green-100 text-green-700'
    case 'bank':
      return 'bg-blue-100 text-blue-700'
    case 'card':
      return 'bg-purple-100 text-purple-700'
    case 'stock':
    case 'foreign_stock':
      return 'bg-orange-100 text-orange-700'
    case 'crypto':
      return 'bg-yellow-100 text-yellow-700'
    case 'receivable':
      return 'bg-teal-100 text-teal-700'
    case 'payable':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function WalletHeader({ wallet, onEdit }: WalletHeaderProps) {
  const IconComponent = getDefaultIcon(wallet.metadata?.type as WalletType)
  const walletTypeDisplay = getWalletTypeDisplay(wallet.metadata?.type as WalletType)
  const statusColor = getStatusColor(wallet.metadata?.type as WalletType, wallet.isActive)
  
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
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 左側 - 錢包資訊 */}
          <div className="flex items-center space-x-4">
            {/* 錢包圖示 */}
            <div className={cn(
              "w-16 h-16 rounded-xl inline-flex flex-col justify-center items-center",
              wallet.metadata?.color || "bg-blue-600"
            )}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            
            {/* 錢包名稱和詳情 */}
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {wallet.name}
                </h1>
                <Badge className={cn("text-xs", statusColor)}>
                  {wallet.isActive ? '啟用' : '停用'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{walletTypeDisplay}</span>
                <span>•</span>
                <span>{wallet.currency || 'TWD'}</span>
                {wallet.metadata?.provider && (
                  <>
                    <span>•</span>
                    <span>{wallet.metadata.provider}</span>
                  </>
                )}
              </div>
              
              {/* 餘額顯示 */}
              <div className="mt-2">
                <div className="text-3xl font-bold text-gray-900">
                  {formatBalance(wallet.balance, wallet.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  最後更新：{new Date(wallet.updatedAt).toLocaleString('zh-TW')}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右側 - 操作按鈕 */}
          <div className="flex items-center space-x-2 md:flex-col md:space-x-0 md:space-y-2">
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
        
        {/* 錢包配置資訊 (如果有的話) */}
        {wallet.metadata?.config && Object.keys(wallet.metadata.config).length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-sm text-gray-600">
              <strong>配置資訊：</strong>
              {wallet.metadata.config.accountNumber && (
                <span className="ml-2">
                  帳號：****{wallet.metadata.config.accountNumber.slice(-4)}
                </span>
              )}
              {wallet.metadata.config.brokerCode && (
                <span className="ml-2">
                  券商：{wallet.metadata.config.brokerCode}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}