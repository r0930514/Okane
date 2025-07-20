"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown,
  Search,
  DollarSign
} from "lucide-react"
import type { Transaction, Wallet } from "@/lib/types"
import TransactionService from "@/lib/services/TransactionService"

interface WalletTransactionsListProps {
  transactions: Transaction[]
  wallet: Wallet
  onTransactionUpdate?: (transactions: Transaction[]) => void
}

// 交易類型圖示對應
const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'income':
      return <ArrowUpRight className="w-4 h-4 text-green-600" />
    case 'expense':
      return <ArrowDownLeft className="w-4 h-4 text-red-600" />
    case 'transfer':
      return <ArrowRightLeft className="w-4 h-4 text-blue-600" />
    case 'buy':
      return <TrendingUp className="w-4 h-4 text-purple-600" />
    case 'sell':
      return <TrendingDown className="w-4 h-4 text-orange-600" />
    default:
      return <DollarSign className="w-4 h-4 text-gray-600" />
  }
}

// 交易類型顏色
const getTransactionColor = (type: string) => {
  switch (type) {
    case 'income':
      return 'bg-green-100 text-green-700'
    case 'expense':
      return 'bg-red-100 text-red-700'
    case 'transfer':
      return 'bg-blue-100 text-blue-700'
    case 'buy':
      return 'bg-purple-100 text-purple-700'
    case 'sell':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 交易卡片組件
function TransactionCard({ transaction, currency }: { transaction: Transaction, currency: string }) {
  const formattedTransaction = TransactionService.formatTransactionForDisplay(transaction)
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        {/* 交易圖示 */}
        <div className="flex-shrink-0">
          {getTransactionIcon(formattedTransaction.type)}
        </div>
        
        {/* 交易詳情 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {formattedTransaction.description}
            </p>
            <Badge className={`text-xs ${getTransactionColor(formattedTransaction.type)}`}>
              {formattedTransaction.typeDisplay}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500">
              {formattedTransaction.formattedDate}
            </p>
            {formattedTransaction.category && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <p className="text-xs text-gray-500">
                  {formattedTransaction.category}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* 金額 */}
      <div className="text-right">
        <p className={`text-sm font-semibold ${
          formattedTransaction.isIncome ? 'text-green-600' : 
          formattedTransaction.isExpense ? 'text-red-600' : 
          'text-gray-900'
        }`}>
          {formattedTransaction.isIncome ? '+' : formattedTransaction.isExpense ? '-' : ''}
          {new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: currency === 'TWD' ? 'TWD' : 'USD'
          }).format(Math.abs(formattedTransaction.amount))}
        </p>
      </div>
    </div>
  )
}

export function WalletTransactionsList({ 
  transactions, 
  wallet
}: WalletTransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 計算統計資料
  const stats = useMemo(() => {
    return TransactionService.calculateTransactionStats(transactions)
  }, [transactions])

  // 篩選和排序交易
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (transaction.metadata?.category || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      
      const matchesType = !typeFilter || transaction.metadata?.type === typeFilter
      
      return matchesSearch && matchesType
    })

    // 排序
    const sortedFiltered = [...filtered].sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sortedFiltered
  }, [transactions, searchTerm, typeFilter, sortBy, sortOrder])

  // 分頁
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedTransactions, currentPage])

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">總收入</p>
                <p className="text-lg font-semibold text-green-600">
                  {new Intl.NumberFormat('zh-TW', {
                    style: 'currency',
                    currency: wallet.currency || 'TWD'
                  }).format(stats.totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowDownLeft className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">總支出</p>
                <p className="text-lg font-semibold text-red-600">
                  {new Intl.NumberFormat('zh-TW', {
                    style: 'currency',
                    currency: wallet.currency || 'TWD'
                  }).format(stats.totalExpense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">淨額</p>
                <p className={`text-lg font-semibold ${
                  stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('zh-TW', {
                    style: 'currency',
                    currency: wallet.currency || 'TWD'
                  }).format(stats.netAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 交易記錄主要區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>交易記錄</span>
            <Badge variant="outline">
              {filteredAndSortedTransactions.length} 筆交易
            </Badge>
          </CardTitle>
          
          {/* 篩選和搜尋 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜尋交易記錄..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="?">全部</SelectItem>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                  <SelectItem value="transfer">轉帳</SelectItem>
                  <SelectItem value="buy">買入</SelectItem>
                  <SelectItem value="sell">賣出</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-')
                setSortBy(field as 'date' | 'amount')
                setSortOrder(order as 'asc' | 'desc')
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">最新在前</SelectItem>
                  <SelectItem value="date-asc">最舊在前</SelectItem>
                  <SelectItem value="amount-desc">金額大到小</SelectItem>
                  <SelectItem value="amount-asc">金額小到大</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* 交易列表 */}
          <div className="space-y-0">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <div key={transaction.id} className="border-b last:border-b-0">
                  <TransactionCard 
                    transaction={transaction} 
                    currency={wallet.currency || 'TWD'}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || typeFilter ? '找不到符合條件的交易記錄' : '尚無交易記錄'}
                </p>
              </div>
            )}
          </div>
          
          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                顯示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedTransactions.length)} - {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} 筆，共 {filteredAndSortedTransactions.length} 筆
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  上一頁
                </Button>
                
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一頁
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}