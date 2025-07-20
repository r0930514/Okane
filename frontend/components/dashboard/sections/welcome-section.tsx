"use client"

import { Sun } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="flex items-center justify-left gap-4">
      <Sun size={40} className="text-amber-500" />
      <h1 className="text-3xl font-bold">早安，Sindy0514</h1>
    </div>
  )
}