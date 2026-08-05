"use client"

import type { CSSProperties } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ManagerAuthGuard } from "@/features/auth/components/ManagerAuthGuard"
import { ManagerSidebar } from "@/features/manager/components/ManagerSidebar"
import { SoloWeekCalendar } from "@/features/manager/components/SoloWeekCalendar"

const ManagerDashboard = () => (
  <ManagerAuthGuard>
    <ManagerDashboardContent />
  </ManagerAuthGuard>
)

const ManagerDashboardContent = () => (
  <TooltipProvider>
    <SidebarProvider
      className="min-h-screen bg-background text-foreground"
      style={
        {
          "--sidebar-width": "15rem",
          "--sidebar-width-icon": "3.5rem",
        } as CSSProperties
      }
    >
      <ManagerSidebar />

      <SidebarInset className="min-w-0 overflow-hidden">
        <SoloWeekCalendar />
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
)

export { ManagerDashboard }
