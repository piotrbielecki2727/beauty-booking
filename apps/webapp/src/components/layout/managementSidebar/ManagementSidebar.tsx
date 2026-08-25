"use client";

import { useState } from "react";

import { ManagementSidebarDesktop } from "@/components/layout/managementSidebar/desktop/ManagementSidebarDesktop";
import { ManagementSidebarMobile } from "@/components/layout/managementSidebar/mobile/ManagementSidebarMobile";
import { useManagementSidebarTransition } from "@/components/layout/managementSidebar/useManagementSidebarTransition";

export const ManagementSidebar = ({
  isCollapsed,
  isSetupMode,
  onIsCollapsedChange,
}: {
  isCollapsed: boolean;
  isSetupMode: boolean;
  onIsCollapsedChange: (isCollapsed: boolean) => void;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const transition = useManagementSidebarTransition({ onIsCollapsedChange });

  return (
    <>
      <ManagementSidebarMobile
        isOpen={isMobileOpen}
        isSetupMode={isSetupMode}
        onIsOpenChange={setIsMobileOpen}
      />
      <ManagementSidebarDesktop
        isCollapsed={isCollapsed}
        isSetupMode={isSetupMode}
        transition={transition}
      />
    </>
  );
};
