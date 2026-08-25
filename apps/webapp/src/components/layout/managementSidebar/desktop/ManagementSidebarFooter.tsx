"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ManagementSidebarLogoutButton } from "@/components/layout/managementSidebar/shared/ManagementSidebarLogoutButton";
import { ManagementSidebarSettingsControls } from "@/components/layout/managementSidebar/shared/ManagementSidebarSettingsControls";
import { cn } from "@/lib/utils";

type ManagementSidebarFooterProperties = {
  isCollapsed: boolean;
  isTransitioning: boolean;
};

export const ManagementSidebarFooter = ({
  isCollapsed,
  isTransitioning,
}: ManagementSidebarFooterProperties) => {
  return (
    <div className="shrink-0 border-t border-line">
      <div
        className={cn(
          "grid gap-3 py-3",
          isTransitioning
            ? "pointer-events-none opacity-0"
            : "opacity-100 transition-opacity duration-150 ease-out",
        )}
      >
        <div
          className={cn(
            "grid h-[5.75rem] w-full items-center px-3",
            isCollapsed ? "justify-items-center gap-3" : "gap-1",
          )}
        >
          {isCollapsed ? (
            <>
              <LanguageSwitcher presentation="compact" variant="sidebar" />
              <ThemeToggle
                className="rounded-full border border-line bg-canvas"
                variant="sidebar"
              />
            </>
          ) : (
            <ManagementSidebarSettingsControls />
          )}
        </div>

        <div className="h-px w-full bg-line" aria-hidden="true" />

        <div className="flex h-12 w-full items-center justify-center px-3">
          <ManagementSidebarLogoutButton isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
};
