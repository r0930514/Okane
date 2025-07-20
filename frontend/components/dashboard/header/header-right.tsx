"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCcwIcon, Search } from "lucide-react"

export function HeaderRight() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Search />
        <span className="sr-only">Search</span>
      </Button>
      <Button variant="ghost" size="icon">
        <RefreshCcwIcon />
        <span className="sr-only">Refresh</span>
      </Button>
      <Button variant="ghost" size="icon">
        <Plus />
        <span className="sr-only">Add</span>
      </Button>
    </div>
  )
}