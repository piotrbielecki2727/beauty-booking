"use client";

import { Tooltip } from "@/components/reusable/Tooltip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { ManagementNavItemConfig } from "@/components/layout/managementSidebar/managementSidebarTypes";

type ManagementNavItemProperties = {
  isActive: boolean;
  isCollapsed?: boolean;
  item: ManagementNavItemConfig;
  label: string;
  onNavigate?: () => void;
};

export const ManagementNavItem = ({
  isActive,
  isCollapsed = false,
  item,
  label,
  onNavigate,
}: ManagementNavItemProperties) => {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      aria-label={isCollapsed ? label : undefined}
      onClick={onNavigate}
      className={cn(
        "flex h-10 min-w-0 items-center gap-2 rounded-md px-3 text-sm font-medium",
        "text-sidebar-foreground/80 transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-2 focus-visible:outline-sidebar-ring",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <span
        className={cn(
          "min-w-0 overflow-hidden whitespace-nowrap",
          "transition-[width,opacity] duration-300 ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-40 opacity-100",
        )}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <Tooltip content={label} disabled={!isCollapsed} side="right">
      {link}
    </Tooltip>
  );
};
