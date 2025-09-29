import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, Wallet, Banknote, CreditCard, TrendingUp, Bitcoin, Building2, FileText, HandCoins } from "lucide-react"
import { WalletType as WalletTypeEnum } from "@/lib/types/wallet"
import { useRouter } from "next/navigation"

interface WalletCardProps {
  id?: string
  name: string
  balance: string | number
  currency?: string
  walletType?: WalletTypeEnum
  icon?: LucideIcon
  color?: string
  className?: string
  onClick?: () => void
}

// 根據帳戶類型選擇預設圖示
const getDefaultIcon = (walletType?: WalletTypeEnum): LucideIcon => {
  switch (walletType) {
    case 'cash':
      return Banknote
    case 'bank':
      return Building2
    case 'crypto':
      return Bitcoin
    default:
      return Wallet
  }
}

export function WalletCard({
  id,
  name,
  balance,
  currency = "TWD",
  walletType,
  icon,
  color = "bg-teal-900",
  className,
  onClick
}: WalletCardProps) {
  const router = useRouter()
  const IconComponent = icon || getDefaultIcon(walletType)
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (id) {
      router.push(`/dashboard/wallets/${id}`)
    }
  }
  
  // 顏色對應表，確保 Tailwind 能正確編譯
  const colorMap: Record<string, string> = {
    'bg-teal-900': 'text-teal-900',
    'bg-blue-900': 'text-blue-900',
    'bg-yellow-900': 'text-yellow-900',
    'bg-green-900': 'text-green-900',
    'bg-red-900': 'text-red-900',
    'bg-purple-900': 'text-purple-900',
    'bg-pink-900': 'text-pink-900',
    'bg-indigo-900': 'text-indigo-900',
    'bg-gray-900': 'text-gray-900',
    'bg-slate-900': 'text-slate-900',
  }
  
  // 從 bg- 類別獲取對應的 text- 類別
  const getTextColorClass = (bgColor: string) => {
    return colorMap[bgColor] || 'text-teal-900'
  }
  
  // 格式化餘額顯示
  const formatBalance = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency === 'TWD' ? 'TWD' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount)
  }

  return (
    <Card 
      className={cn(
        "min-w-44 px-6 py-3 bg-white rounded-2xl shadow-[0px_2px_4px_0px_rgba(0,0,0,0.06)] outline-1 outline-offset-[-1px] outline-gray-200",
        id ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : "",
        className
      )}
      onClick={handleClick}
    >
      <div className="inline-flex justify-start items-center gap-4">
        {/* 圖示區域 */}
        <div className={cn(
          "w-10 h-10 rounded-lg inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden",
          color
        )}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        
        {/* 內容區域 */}
        <div className="flex-1 flex justify-start items-center gap-4">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <div className={cn(
                "opacity-80 justify-start text-base font-medium leading-normal",
                getTextColorClass(color)
              )}>
                {name}
              </div>
            </div>
            <div className="justify-start text-gray-800 text-2xl font-medium leading-normal">
              {formatBalance(balance)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}