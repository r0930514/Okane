import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className
}: StatCardProps) {
  const getValueColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-zinc-700"
    }
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="opacity-80 text-zinc-600 text-base font-normal">
            {title}
          </div>
          <div className={cn("text-4xl font-semibold", getValueColor())}>
            {value}
          </div>
          <div className="opacity-40 text-zinc-600 text-xs">
            {change}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <Icon className="w-8 h-8 text-zinc-800" />
          </div>
        </div>
      </div>
    </Card>
  )
}