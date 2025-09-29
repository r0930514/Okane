"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import type { Wallet, Transaction } from "@/lib/types"

interface WalletBalanceChartProps {
  wallet: Wallet
  transactions: Transaction[]
}

interface BalanceDataPoint {
  date: string
  balance: number
  formattedDate: string
  transaction?: Transaction
}

export function WalletBalanceChart({ wallet, transactions }: WalletBalanceChartProps) {
  // 計算每日餘額變化
  const balanceHistory = useMemo(() => {
    if (transactions.length === 0) {
      // 如果沒有交易記錄，就顯示當前餘額
      return [{
        date: new Date().toISOString().split('T')[0],
        balance: wallet.balance,
        formattedDate: new Date().toLocaleDateString('zh-TW'),
      }]
    }

    // 按日期排序交易
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const balanceData: BalanceDataPoint[] = []
    let runningBalance = 0

    // 計算每筆交易後的餘額
    sortedTransactions.forEach((transaction) => {
      const transactionType = transaction.metadata?.type || ''
      
      // 根據交易類型計算餘額變化
      if (transactionType === 'income') {
        runningBalance += transaction.amount
      } else if (transactionType === 'expense') {
        runningBalance -= transaction.amount
      } else if (transactionType === 'transfer') {
        // 轉帳的處理依據轉帳方向
        const transferDirection = transaction.metadata?.transferDirection
        if (transferDirection === 'in') {
          runningBalance += transaction.amount
        } else if (transferDirection === 'out') {
          runningBalance -= transaction.amount
        }
      } else if (transactionType === 'buy') {
        runningBalance -= transaction.amount
      } else if (transactionType === 'sell') {
        runningBalance += transaction.amount
      }

      const date = new Date(transaction.date)
      const dateStr = date.toISOString().split('T')[0]
      
      balanceData.push({
        date: dateStr,
        balance: runningBalance,
        formattedDate: date.toLocaleDateString('zh-TW'),
        transaction
      })
    })

    // 加入當前餘額作為最後一個資料點
    const lastTransactionDate = sortedTransactions[sortedTransactions.length - 1]?.date
    const currentDate = new Date()
    
    if (!lastTransactionDate || new Date(lastTransactionDate).toDateString() !== currentDate.toDateString()) {
      balanceData.push({
        date: currentDate.toISOString().split('T')[0],
        balance: wallet.balance,
        formattedDate: currentDate.toLocaleDateString('zh-TW'),
      })
    }

    return balanceData
  }, [transactions, wallet.balance])

  // 計算趨勢
  const trend = useMemo(() => {
    if (balanceHistory.length < 2) return { direction: 'neutral', change: 0, percentage: 0 }

    const firstBalance = balanceHistory[0].balance
    const lastBalance = balanceHistory[balanceHistory.length - 1].balance
    const change = lastBalance - firstBalance
    const percentage = firstBalance !== 0 ? (change / Math.abs(firstBalance)) * 100 : 0

    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change,
      percentage: Math.abs(percentage)
    }
  }, [balanceHistory])

  // 圖表配置
  const chartConfig = {
    balance: {
      label: "餘額",
      color: "hsl(var(--chart-1))",
    },
  }

  // 格式化金額
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: wallet.currency || 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>餘額變化趨勢</span>
          </div>
          
          {/* 趨勢指示器 */}
          <div className="flex items-center space-x-2">
            {trend.direction === 'up' ? (
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{trend.percentage.toFixed(1)}%
                </span>
              </div>
            ) : trend.direction === 'down' ? (
              <div className="flex items-center space-x-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  -{trend.percentage.toFixed(1)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-gray-500">
                <span className="text-sm font-medium">無變化</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {balanceHistory.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={balanceHistory}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-balance)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-balance)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number) => [formatCurrency(value), '餘額']}
                labelFormatter={(label) => `日期：${label}`}
              />
              <Area
                dataKey="balance"
                type="monotone"
                fill="url(#fillBalance)"
                fillOpacity={0.4}
                stroke="var(--color-balance)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>尚無足夠資料顯示餘額趨勢</p>
              <p className="text-sm">進行一些交易後，這裡將顯示餘額變化圖表</p>
            </div>
          </div>
        )}

        {/* 統計摘要 */}
        {balanceHistory.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">期初餘額</p>
                <p className="font-semibold">{formatCurrency(balanceHistory[0].balance)}</p>
              </div>
              <div>
                <p className="text-gray-500">期末餘額</p>
                <p className="font-semibold">{formatCurrency(balanceHistory[balanceHistory.length - 1].balance)}</p>
              </div>
              <div>
                <p className="text-gray-500">變化金額</p>
                <p className={`font-semibold ${
                  trend.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.change >= 0 ? '+' : ''}{formatCurrency(trend.change)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">變化比例</p>
                <p className={`font-semibold ${
                  trend.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.change >= 0 ? '+' : '-'}{trend.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}