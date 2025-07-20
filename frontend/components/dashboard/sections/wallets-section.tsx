"use client"

import { WalletCard } from "@/components/dashboard/wallet-card"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon } from "lucide-react"

export function WalletsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">錢包</h2>
        <Button variant="outline" size="sm">
          <PanelLeftIcon className="mr-2" />
          新增錢包
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WalletCard
          name="主要錢包"
          balance="100000"
          currency="TWD"
          walletType="cash"
          color="bg-teal-900"
        />
        <WalletCard
          name="信用卡"
          balance="50000"
          currency="TWD"
          walletType="card"
          color="bg-blue-900"
        />
        <WalletCard
          name="PayPal"
          balance="30000"
          currency="USD"
          walletType="crypto"
          color="bg-yellow-900"
        />
      </div>
    </div>
  )
}