"use client";

import { useSession } from "next-auth/react";

import { ManagementSidebar } from "@/components/layout/managementSidebar";
import { MANAGEMENT_SIDEBAR_COLLAPSED_KEY } from "@/components/layout/managementSidebar/managementSidebarConfig";
import { LoadingOverlay } from "@/components/reusable";
import {
  BusinessSetupProvider,
  useBusinessSetup,
} from "@/features/businessSetup/providers";
import { useTenantContext } from "@/features/tenant";
import { usePersistentBoolean } from "@/hooks/usePersistentBoolean";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type ManagementAppShellProperties = {
  children: ReactNode;
  isSidebarInitiallyCollapsed?: boolean;
};

type ManagementAppShellContentProperties = {
  children: ReactNode;
  isSidebarCollapsed: boolean;
  onIsSidebarCollapsedChange: (isCollapsed: boolean) => void;
};

const ManagementAppShellContent = ({
  children,
  isSidebarCollapsed,
  onIsSidebarCollapsedChange,
}: ManagementAppShellContentProperties) => {
  const { status } = useSession();
  const { isSetupLoading } = useBusinessSetup();
  const { isTenantContextLoading } = useTenantContext();
  const isSidebarDataLoading =
    status === "loading" || isSetupLoading || isTenantContextLoading;

  if (isSidebarDataLoading) {
    return <LoadingOverlay variant="bare" />;
  }

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
        onIsCollapsedChange={onIsSidebarCollapsedChange}
      />
      <main className="min-w-0">{children}</main>
    </div>
  );
};

export const ManagementAppShell = ({
  children,
  isSidebarInitiallyCollapsed = false,
}: ManagementAppShellProperties) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentBoolean(
    MANAGEMENT_SIDEBAR_COLLAPSED_KEY,
    isSidebarInitiallyCollapsed,
  );

  return (
    <BusinessSetupProvider>
      <ManagementAppShellContent
        isSidebarCollapsed={isSidebarCollapsed}
        onIsSidebarCollapsedChange={setIsSidebarCollapsed}
      >
        {children}
      </ManagementAppShellContent>
    </BusinessSetupProvider>
  );
};

export type { ManagementAppShellProperties };
