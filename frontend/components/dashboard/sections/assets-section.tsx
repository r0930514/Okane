"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DollarSign, Loader2 } from "lucide-react"
import WalletService from "@/lib/services/WalletService"

interface WalletStats {
  totalWallets: number;
  totalBalance: number;
  activeWallets: number;
  balancesByCurrency: Record<string, number>;
}

export function AssetsSection() {
  const [stats, setStats] = useState<WalletStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await WalletService.getWalletStats()
        
        if (response.success && response.data) {
          setStats(response.data)
          console.log("Wallet stats loaded:", response.data)
        } else {
          setError(response.error || '無法載入統計資料')
        }
      } catch (err) {
        setError('載入統計資料時發生錯誤')
        console.error('Error loading wallet stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatCurrency = (amount: number, currency: string = 'TWD') => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency === 'TWD' ? 'TWD' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getMainCurrencyBalance = () => {
    if (!stats) return 0
    const currencies = Object.keys(stats.balancesByCurrency)
    if (currencies.length === 0) return 0
    
    // 優先顯示 TWD，其次是最大餘額的幣種
    if (stats.balancesByCurrency.TWD) {
      return stats.balancesByCurrency.TWD
    }
    
    const maxCurrency = currencies.reduce((a, b) => 
      stats.balancesByCurrency[a] > stats.balancesByCurrency[b] ? a : b
    )
    return stats.balancesByCurrency[maxCurrency]
  }

  const getMainCurrency = () => {
    if (!stats) return 'TWD'
    const currencies = Object.keys(stats.balancesByCurrency)
    if (currencies.length === 0) return 'TWD'
    
    if (stats.balancesByCurrency.TWD) {
      return 'TWD'
    }
    
    return currencies.reduce((a, b) => 
      stats.balancesByCurrency[a] > stats.balancesByCurrency[b] ? a : b
    )
  }

  const renderFirstCard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6 border rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>載入中...</span>
        </div>
      )
    }

    if (error) {
      return (
        <StatCard
          title="總資產"
          value="--"
          change="載入失敗"
          changeType="negative"
          icon={DollarSign}
        />
      )
    }

    if (!stats) {
      return (
        <StatCard
          title="總資產"
          value="$0"
          change="無資料"
          changeType="neutral"
          icon={DollarSign}
        />
      )
    }

    const mainBalance = getMainCurrencyBalance()
    const mainCurrency = getMainCurrency()
    const currencyCount = Object.keys(stats.balancesByCurrency).length

    return (
      <StatCard
        title="總資產"
        value={formatCurrency(mainBalance, mainCurrency)}
        change={`${currencyCount} 種幣別`}
        changeType="neutral"
        icon={DollarSign}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">資產狀況</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderFirstCard()}
        <StatCard
          title="淨資產"
          value="$96,400"
          change="21% 增長"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="淨資產"
          value="$0"
          change="0% 增長"
          changeType="negative"
          icon={DollarSign}
        />
      </div>
    </div>
  )
}