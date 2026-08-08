"use client";

import { useState } from "react";

import { ManagementSidebarDesktop } from "@/components/layout/managementSidebar/desktop/ManagementSidebarDesktop";
import { ManagementSidebarMobile } from "@/components/layout/managementSidebar/mobile/ManagementSidebarMobile";
import { useManagementSidebarTransition } from "@/components/layout/managementSidebar/useManagementSidebarTransition";

export const ManagementSidebar = ({
  isCollapsed,
  onIsCollapsedChange,
}: {
  isCollapsed: boolean;
  onIsCollapsedChange: (isCollapsed: boolean) => void;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const transition = useManagementSidebarTransition({ onIsCollapsedChange });

  return (
    <>
      <ManagementSidebarMobile
        isOpen={isMobileOpen}
        onIsOpenChange={setIsMobileOpen}
      />
      <ManagementSidebarDesktop
        isCollapsed={isCollapsed}
        transition={transition}
      />
    </>
  );
};
