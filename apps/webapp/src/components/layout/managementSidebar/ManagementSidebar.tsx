"use client";

import { useState } from "react";

import { ManagementSidebarDesktop } from "@/components/layout/managementSidebar/desktop/ManagementSidebarDesktop";
import { ManagementSidebarMobile } from "@/components/layout/managementSidebar/mobile/ManagementSidebarMobile";
import { useManagementSidebarTransition } from "@/components/layout/managementSidebar/useManagementSidebarTransition";

import type { BusinessType } from "@beauty-booking/shared";

export const ManagementSidebar = ({
  businessType,
  isCollapsed,
  isSetupMode,
  onIsCollapsedChange,
}: {
  businessType: BusinessType | null;
  isCollapsed: boolean;
  isSetupMode: boolean;
  onIsCollapsedChange: (isCollapsed: boolean) => void;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const transition = useManagementSidebarTransition({ onIsCollapsedChange });

  return (
    <>
      <ManagementSidebarMobile
        businessType={businessType}
        isOpen={isMobileOpen}
        isSetupMode={isSetupMode}
        onIsOpenChange={setIsMobileOpen}
      />
      <ManagementSidebarDesktop
        businessType={businessType}
        isCollapsed={isCollapsed}
        isSetupMode={isSetupMode}
        transition={transition}
      />
    </>
  );
};
