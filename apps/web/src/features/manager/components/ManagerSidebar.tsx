"use client"

import {
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const ManagerSidebar = () => (
  <Sidebar
    collapsible="icon"
    className="z-50 border-white/10 text-white [&_[data-slot=sidebar-container]]:z-50 [&_[data-slot=sidebar-inner]]:bg-neutral-950 [&_[data-slot=sidebar-inner]]:text-white"
  >
    <SidebarHeader className="h-20 p-0" />
    <div className="absolute right-0 top-24 z-20 translate-x-1/2">
      <ManagerSidebarToggle />
    </div>
  </Sidebar>
)

const ManagerSidebarToggle = () => {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <button
      aria-label={isCollapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
      className={cn(
        "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-white/72 shadow-lg ring-2 ring-background transition-colors hover:bg-white hover:text-neutral-950"
      )}
      onClick={toggleSidebar}
      type="button"
    >
      {isCollapsed ? (
        <PanelLeftOpen aria-hidden="true" className="size-5" />
      ) : (
        <PanelLeftClose aria-hidden="true" className="size-5" />
      )}
    </button>
  )
}

export { ManagerSidebar }
