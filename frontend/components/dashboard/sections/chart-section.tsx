"use client"

import { ChartLineLabel } from "@/components/dashboard/components/chart-line-label"

export function ChartSection() {
  return (
    <div className="flex h-fit w-full flex-col gap-4">
      <ChartLineLabel />
    </div>
  )
}