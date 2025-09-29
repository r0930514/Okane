import { useState, useEffect, useCallback, useMemo } from 'react'
import WalletService from '@/lib/services/WalletService'
import type { Wallet } from '@/lib/types'

interface UseWalletsListResult {
  wallets: Wallet[]
  loading: boolean
  error: string | null
  refetch: () => void
  stats: WalletsStats
}

interface WalletsStats {
  totalWallets: number
  activeWallets: number
  totalBalance: number
  balancesByCurrency: Record<string, number>
  walletsByType: Record<string, number>
}

interface UseWalletsListOptions {
  /**
   * 如果為 true，當發生錯誤時會自動重試
   */
  autoRetry?: boolean
  /**
   * 重試延遲時間（毫秒）
   */
  retryDelay?: number
  /**
   * 是否在載入失敗時允許空陣列（而非顯示錯誤）
   */
  allowEmptyOnError?: boolean
  /**
   * 是否只顯示啟用的錢包
   */
  activeOnly?: boolean
}

/**
 * 管理錢包列表的 Hook
 * @param options - 可選配置
 * @returns 錢包列表、載入狀態、錯誤資訊、重新載入函數和統計資料
 */
export function useWalletsList(
  options: UseWalletsListOptions = {}
): UseWalletsListResult {
  const { 
    autoRetry = false, 
    retryDelay = 3000,
    allowEmptyOnError = true,
    activeOnly = false
  } = options

  const [allWallets, setAllWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 根據 activeOnly 過濾錢包
  const wallets = useMemo(() => {
    if (activeOnly) {
      return allWallets.filter(wallet => wallet.status === 'active')
    }
    return allWallets
  }, [allWallets, activeOnly])

  // 計算統計資料
  const stats: WalletsStats = useMemo(() => {
    const activeWallets = allWallets.filter(w => w.status === 'active')
    
    let totalBalance = 0
    const balancesByCurrency: Record<string, number> = {}
    const walletsByType: Record<string, number> = {}

    activeWallets.forEach(wallet => {
      // 計算總餘額和各幣種餘額
      totalBalance += wallet.balance
      const currency = wallet.currency || 'TWD'
      balancesByCurrency[currency] = (balancesByCurrency[currency] || 0) + wallet.balance

      // 統計錢包類型
      const type = wallet.type || 'unknown'
      walletsByType[type] = (walletsByType[type] || 0) + 1
    })

    return {
      totalWallets: allWallets.length,
      activeWallets: activeWallets.length,
      totalBalance,
      balancesByCurrency,
      walletsByType
    }
  }, [allWallets])

  const loadWallets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await WalletService.getAllWallets()

      if (response.success && response.data) {
        setAllWallets(response.data)
        setError(null)
      } else {
        const errorMessage = response.error || '無法載入錢包資料，請檢查網路連線或稍後重試'
        
        if (allowEmptyOnError) {
          setAllWallets([])
          setError(errorMessage)
          console.warn('載入錢包資料失敗，使用空陣列:', errorMessage)
        } else {
          setError(errorMessage)
          console.error('載入錢包資料失敗:', errorMessage)
        }
        
        // 自動重試邏輯
        if (autoRetry) {
          setTimeout(() => {
            loadWallets()
          }, retryDelay)
        }
      }
    } catch (err) {
      const errorMessage = '載入錢包資料時發生錯誤，請檢查網路連線或稍後重試'
      
      if (allowEmptyOnError) {
        setAllWallets([])
        setError(errorMessage)
        console.warn('載入錢包資料時發生錯誤，使用空陣列:', err)
      } else {
        setError(errorMessage)
        console.error('載入錢包資料時發生錯誤:', err)
      }
      
      // 自動重試邏輯
      if (autoRetry) {
        setTimeout(() => {
          loadWallets()
        }, retryDelay)
      }
    } finally {
      setLoading(false)
    }
  }, [autoRetry, retryDelay, allowEmptyOnError])

  // 手動重新載入函數
  const refetch = useCallback(() => {
    loadWallets()
  }, [loadWallets])

  useEffect(() => {
    loadWallets()
  }, [loadWallets])

  return {
    wallets,
    loading,
    error,
    refetch,
    stats
  }
}