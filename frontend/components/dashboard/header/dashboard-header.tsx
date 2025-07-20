"use client"

import { useEffect, useState } from "react"
import { HeaderLeft } from "./header-left"
import { HeaderRight } from "./header-right"

export function DashboardHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`bg-white/90 backdrop-blur-md sticky top-0 flex h-16 shrink-0 items-center gap-2 px-4 ${
        scrolled ? "border-b" : "border-b-transparent"
      }`}
    >
      <div className="flex justify-between w-full gap-2 px-4">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </header>
  )
}