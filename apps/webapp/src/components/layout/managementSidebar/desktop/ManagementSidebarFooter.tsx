"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

type ManagementSidebarFooterProperties = {
  isCollapsed: boolean;
};

export const ManagementSidebarFooter = ({
  isCollapsed,
}: ManagementSidebarFooterProperties) => {
  return (
    <div
      className={cn(
        "flex shrink-0 border-t border-sidebar-border p-3",
        isCollapsed
          ? "flex-col items-center gap-2"
          : "items-center justify-between gap-2",
      )}
    >
      <LanguageSwitcher variant="sidebar" />
      <ThemeToggle variant="sidebar" />
    </div>
  );
};
