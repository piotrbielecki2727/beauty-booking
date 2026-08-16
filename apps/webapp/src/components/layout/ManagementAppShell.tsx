"use client";

import { ManagementSidebar } from "@/components/layout/managementSidebar";
import { usePersistentBoolean } from "@/hooks/usePersistentBoolean";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "management-sidebar-collapsed";

export const ManagementAppShell = ({ children }: { children: ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentBoolean(
    SIDEBAR_COLLAPSED_STORAGE_KEY,
    false,
  );

  return (
    <div
      className={cn(
        "grid min-h-screen bg-canvas transition-[grid-template-columns] duration-300 ease-in-out",
        "md:grid-cols-[16rem_minmax(0,1fr)]",
        isSidebarCollapsed && "md:grid-cols-[5rem_minmax(0,1fr)]",
      )}
    >
      <ManagementSidebar
        isCollapsed={isSidebarCollapsed}
        onIsCollapsedChange={setIsSidebarCollapsed}
      />
      <main className="min-w-0">{children}</main>
    </div>
  );
};
