"use client";

import { ManagementSidebarAccountSummary } from "@/components/layout/managementSidebar/desktop/ManagementSidebarAccountSummary";
import { ManagementSidebarFooter } from "@/components/layout/managementSidebar/desktop/ManagementSidebarFooter";
import { ManagementSidebarHeader } from "@/components/layout/managementSidebar/desktop/ManagementSidebarHeader";
import { ManagementSidebarNav } from "@/components/layout/managementSidebar/desktop/ManagementSidebarNav";

import type { ManagementSidebarTransition } from "@/components/layout/managementSidebar/managementSidebarTypes";
import type { BusinessType } from "@beauty-booking/shared";

type ManagementSidebarDesktopProperties = {
  businessType: BusinessType | null;
  isCollapsed: boolean;
  isSetupMode: boolean;
  transition: ManagementSidebarTransition;
};

export const ManagementSidebarDesktop = ({
  businessType,
  isCollapsed,
  isSetupMode,
  transition,
}: ManagementSidebarDesktopProperties) => {
  return (
    <aside
      className="sticky top-0 z-30 hidden h-dvh min-w-0 self-start flex-col overflow-visible border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
    >
      <ManagementSidebarHeader
        isCollapsed={isCollapsed}
        isSetupMode={isSetupMode}
        transition={transition}
      />
      {!isSetupMode ? (
        <ManagementSidebarAccountSummary isCollapsed={isCollapsed} />
      ) : null}
      <ManagementSidebarNav
        businessType={businessType}
        isCollapsed={isCollapsed}
        isSetupMode={isSetupMode}
        isTransitioning={transition.isTransitioning}
      />
      <ManagementSidebarFooter
        isCollapsed={isCollapsed}
        isTransitioning={transition.isTransitioning}
      />
    </aside>
  );
};
