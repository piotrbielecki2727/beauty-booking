"use client";

import { useMemo } from "react";

import { managementNavItems } from "@/components/layout/managementSidebar/managementSidebarConfig";
import { useBusinessSetup } from "@/features/businessSetup/providers";

export const useManagementSetupNavItems = () => {
  const { setup } = useBusinessSetup();

  return useMemo(
    () =>
      managementNavItems.filter(
        (item) =>
          !item.shouldHideWhenSetupCompleted ||
          setup?.setup.status !== "COMPLETED",
      ),
    [setup],
  );
};
