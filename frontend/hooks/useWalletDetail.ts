import { useState, useEffect, useCallback } from 'react'
import WalletService from '@/lib/services/WalletService'
import type { Wallet } from '@/lib/types'

interface UseWalletDetailResult {
  wallet: Wallet | null
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseWalletDetailOptions {
  /**
   * 如果為 true，當發生錯誤時會自動重試
   */
  autoRetry?: boolean
  /**
   * 重試延遲時間（毫秒）
   */
  retryDelay?: number
}

/**
 * 管理單一錢包詳情的 Hook
 * @param walletId - 錢包 ID
 * @param options - 可選配置
 * @returns 錢包資料、載入狀態、錯誤資訊和重新載入函數
 */
export function useWalletDetail(
  walletId: string | null, 
  options: UseWalletDetailOptions = {}
): UseWalletDetailResult {
  const { autoRetry = false, retryDelay = 3000 } = options
  
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWallet = useCallback(async () => {
    if (!walletId) {
      setWallet(null)
      setLoading(false)
      setError('錢包 ID 無效')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await WalletService.getWallet(walletId)

      if (response.success && response.data) {
        setWallet(response.data)
        setError(null)
      } else {
        const errorMessage = response.error || '錢包不存在或無法載入'
        setError(errorMessage)
        setWallet(null)
        console.error('載入錢包失敗:', errorMessage)
        
        // 自動重試邏輯
        if (autoRetry && response.error !== '錢包不存在') {
          setTimeout(() => {
            loadWallet()
          }, retryDelay)
        }
      }
    } catch (err) {
      const errorMessage = '載入錢包資料時發生錯誤，請檢查網路連線或稍後重試'
      setError(errorMessage)
      setWallet(null)
      console.error('載入錢包資料失敗:', err)
      
      // 自動重試邏輯
      if (autoRetry) {
        setTimeout(() => {
          loadWallet()
        }, retryDelay)
      }
    } finally {
      setLoading(false)
    }
  }, [walletId, autoRetry, retryDelay])

  // 手動重新載入函數
  const refetch = useCallback(() => {
    loadWallet()
  }, [loadWallet])

  useEffect(() => {
    loadWallet()
  }, [loadWallet])

  return {
    wallet,
    loading,
    error,
    refetch
  }
}