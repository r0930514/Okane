"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isCollapsed ? (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
      ) : (
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          <span className="text-blue-600">O</span>kane
        </h1>
      )}
    </div>
  )
}