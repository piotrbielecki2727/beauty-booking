"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { ManagementSidebar } from "@/components/layout/managementSidebar";
import {
  isManagementTeamRoute,
  MANAGEMENT_SIDEBAR_COLLAPSED_KEY,
} from "@/components/layout/managementSidebar/managementSidebarConfig";
import { LoadingOverlay } from "@/components/reusable";
import { useBusinessSetupStatus } from "@/features/businessSetup/hooks";
import { useTenantContext } from "@/features/tenant";
import { usePersistentBoolean } from "@/hooks/usePersistentBoolean";
import { usePathname, useRouter } from "@/i18n/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const { status } = useSession();
  const { isTenantContextLoading } = useTenantContext();
  const {
    businessType,
    hasSetupStatusError,
    isSetupStatusLoading,
    setupStatus,
  } = useBusinessSetupStatus();
  const isSetupRoute = pathname === "/management/setup";
  const isSetupCompleted = setupStatus === "COMPLETED";
  const shouldRedirectToSetup =
    setupStatus !== null && !isSetupCompleted && !isSetupRoute;
  const shouldRedirectToManagement = isSetupCompleted && isSetupRoute;
  const shouldRedirectFromTeamRoute =
    isSetupCompleted &&
    businessType === "SOLO" &&
    isManagementTeamRoute(pathname);
  const isSidebarDataLoading =
    status === "loading" || isTenantContextLoading || isSetupStatusLoading;

  useEffect(() => {
    if (shouldRedirectToSetup) {
      router.replace("/management/setup");
      return;
    }

    if (shouldRedirectToManagement) {
      router.replace("/management");
      return;
    }

    if (shouldRedirectFromTeamRoute) {
      router.replace("/management");
    }
  }, [
    router,
    shouldRedirectFromTeamRoute,
    shouldRedirectToManagement,
    shouldRedirectToSetup,
  ]);

  if (
    isSidebarDataLoading ||
    shouldRedirectToSetup ||
    shouldRedirectToManagement ||
    shouldRedirectFromTeamRoute
  ) {
    return <LoadingOverlay variant="bare" />;
  }

  if (hasSetupStatusError || setupStatus === null) {
    return (
      <LoadingOverlay
        description={t("businessSetup.feedback.loadFailed")}
        variant="bare"
      />
    );
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
        businessType={businessType}
        isCollapsed={isSidebarCollapsed}
        isSetupMode={!isSetupCompleted}
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
    <ManagementAppShellContent
      isSidebarCollapsed={isSidebarCollapsed}
      onIsSidebarCollapsedChange={setIsSidebarCollapsed}
    >
      {children}
    </ManagementAppShellContent>
  );
};

export type { ManagementAppShellProperties };
