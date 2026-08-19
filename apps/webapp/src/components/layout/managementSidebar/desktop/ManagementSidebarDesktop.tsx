"use client";

import { ManagementSidebarAccountSummary } from "@/components/layout/managementSidebar/desktop/ManagementSidebarAccountSummary";
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
  return (
    <aside
      className="sticky top-0 z-30 hidden h-dvh min-w-0 self-start flex-col overflow-visible border-r border-line bg-canvas text-copy md:flex"
    >
      <ManagementSidebarHeader
        isCollapsed={isCollapsed}
        transition={transition}
      />
      <ManagementSidebarAccountSummary isCollapsed={isCollapsed} />
      <ManagementSidebarNav
        isCollapsed={isCollapsed}
        isTransitioning={transition.isTransitioning}
      />
      <ManagementSidebarFooter
        isCollapsed={isCollapsed}
        isTransitioning={transition.isTransitioning}
      />
    </aside>
  );
};
