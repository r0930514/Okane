"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { DollarSign } from "lucide-react"

export function AssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">資產狀況</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="淨資產"
          value="$96,400"
          change="21% 增長"
          changeType="neutral"
          icon={DollarSign}
        />
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