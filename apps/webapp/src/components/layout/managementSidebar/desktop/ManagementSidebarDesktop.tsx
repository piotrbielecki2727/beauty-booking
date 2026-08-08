"use client";

import { useState } from "react";

import { ManagementSidebarFooter } from "@/components/layout/managementSidebar/desktop/ManagementSidebarFooter";
import { ManagementSidebarHeader } from "@/components/layout/managementSidebar/desktop/ManagementSidebarHeader";
import { ManagementSidebarNav } from "@/components/layout/managementSidebar/desktop/ManagementSidebarNav";

import type { ManagementSidebarTransition } from "@/components/layout/managementSidebar/managementSidebarTypes";

type ManagementSidebarDesktopProperties = {
  isCollapsed: boolean;
  transition: ManagementSidebarTransition;
};

export const ManagementSidebarDesktop = ({
  isCollapsed,
  transition,
}: ManagementSidebarDesktopProperties) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <aside
      className="hidden min-h-screen min-w-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <ManagementSidebarHeader
        isCollapsed={isCollapsed}
        isSidebarHovered={isSidebarHovered}
        transition={transition}
      />
      <ManagementSidebarNav
        isCollapsed={isCollapsed}
        isTransitioning={transition.isTransitioning}
      />
      <ManagementSidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};
