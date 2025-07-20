import { useState, useEffect, useCallback, useMemo } from 'react'
import TransactionService from '@/lib/services/TransactionService'
import type { Transaction, TransactionQuery } from '@/lib/types'

interface UseWalletTransactionsResult {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  refetch: () => void
  stats: TransactionStats
}

interface TransactionStats {
  totalIncome: number
  totalExpense: number
  netAmount: number
  transactionCount: number
}

interface UseWalletTransactionsOptions {
  /**
   * 額外的查詢參數
   */
  query?: Omit<TransactionQuery, 'walletId'>
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
}

/**
 * 管理錢包交易記錄的 Hook
 * @param walletId - 錢包 ID
 * @param options - 可選配置
 * @returns 交易記錄、載入狀態、錯誤資訊、重新載入函數和統計資料
 */
export function useWalletTransactions(
  walletId: string | null,
  options: UseWalletTransactionsOptions = {}
): UseWalletTransactionsResult {
  const { 
    query = {}, 
    autoRetry = false, 
    retryDelay = 3000,
    allowEmptyOnError = true 
  } = options

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 計算統計資料
  const stats: TransactionStats = useMemo(() => {
    return TransactionService.calculateTransactionStats(transactions)
  }, [transactions])

  const loadTransactions = useCallback(async () => {
    if (!walletId) {
      setTransactions([])
      setLoading(false)
      setError(allowEmptyOnError ? null : '錢包 ID 無效')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const queryParams: TransactionQuery = {
        walletId,
        ...query
      }

      const response = await TransactionService.getAllTransactions(queryParams)

      if (response.success && response.data) {
        setTransactions(response.data)
        setError(null)
      } else {
        const errorMessage = response.error || '無法載入交易記錄'
        
        if (allowEmptyOnError) {
          setTransactions([])
          setError(errorMessage)
          console.warn('載入交易記錄失敗，使用空陣列:', errorMessage)
        } else {
          setError(errorMessage)
          console.error('載入交易記錄失敗:', errorMessage)
        }
        
        // 自動重試邏輯
        if (autoRetry) {
          setTimeout(() => {
            loadTransactions()
          }, retryDelay)
        }
      }
    } catch (err) {
      const errorMessage = '載入交易記錄時發生錯誤，請檢查網路連線或稍後重試'
      
      if (allowEmptyOnError) {
        setTransactions([])
        setError(errorMessage)
        console.warn('載入交易記錄時發生錯誤，使用空陣列:', err)
      } else {
        setError(errorMessage)
        console.error('載入交易記錄時發生錯誤:', err)
      }
      
      // 自動重試邏輯
      if (autoRetry) {
        setTimeout(() => {
          loadTransactions()
        }, retryDelay)
      }
    } finally {
      setLoading(false)
    }
  }, [walletId, JSON.stringify(query), autoRetry, retryDelay, allowEmptyOnError])

  // 手動重新載入函數
  const refetch = useCallback(() => {
    loadTransactions()
  }, [loadTransactions])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  return {
    transactions,
    loading,
    error,
    refetch,
    stats
  }
}