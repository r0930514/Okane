"use client"

import { AppSidebar } from "@/components/dashboard/layout/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WalletLayoutClient } from "./wallet-layout-client"

interface WalletLayoutProps {
  children: React.ReactNode
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <WalletLayoutClient>
          {children}
        </WalletLayoutClient>
      </SidebarInset>
    </SidebarProvider>
  )
}