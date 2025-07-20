"use client"

import { AppSidebar } from "@/components/dashboard/layout/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header/dashboard-header"
import { AssetsSection, ChartSection, WalletsSection, WelcomeSection } from "@/components/dashboard/sections"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 px-8 py-4">
          <WelcomeSection />
          <ChartSection />
          <div className="flex-1 space-y-4">
            <AssetsSection />
            <WalletsSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
