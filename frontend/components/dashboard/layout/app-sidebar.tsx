"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Home,
  PieChart,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/navigation/nav-main"
import { NavProjects } from "@/components/dashboard/navigation/nav-projects"
import { NavUser } from "@/components/dashboard/navigation/nav-user"
import { Logo } from "@/components/shared/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "張元信",
    email: "r0930514@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "錢包",
      url: "#",
      icon: Wallet,
      isActive: true,
      items: [
        { title: "現金", url: "#" },
        { title: "加密貨幣", url: "#" },
        { title: "股票", url: "#" }, 
      ]
    },
  ],
  projects: [
    {
      name: "首頁",
      url: "#",
      icon: Home,
    },
    {
      name: "分析",
      url: "#",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
