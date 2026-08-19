"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { sidebarControlClassNames } from "@/components/layout/layoutControlVariantStyles";
import { Button } from "@/components/reusable";
import { Logo } from "@/components/reusable/Logo";
import { Tooltip } from "@/components/reusable/Tooltip";
import { useTenantContext } from "@/features/tenant";
import { cn } from "@/lib/utils";

import type { ManagementSidebarTransition } from "@/components/layout/managementSidebar/managementSidebarTypes";

type ManagementSidebarHeaderProperties = {
  isCollapsed: boolean;
  transition: ManagementSidebarTransition;
};

export const ManagementSidebarHeader = ({
  isCollapsed,
  transition,
}: ManagementSidebarHeaderProperties) => {
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel = business?.name ?? t("common.appName");

  const { handleCollapseSidebar, handleExpandSidebar, isTransitioning } =
    transition;
  const toggleLabel = isCollapsed
    ? t("navigation.expandSidebar")
    : t("navigation.collapseSidebar");
  const ToggleIcon = isCollapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon;
  const handleToggleSidebar = isCollapsed
    ? handleExpandSidebar
    : handleCollapseSidebar;

  return (
    <div className="relative flex h-16 shrink-0 items-center border-b border-line px-6">
      <div
        aria-label={brandLabel}
        className="flex min-w-0 origin-left items-center cursor-default"
      >
        <span className="flex size-8 shrink-0 items-center justify-center">
          <Logo aria-hidden="true" size="md" />
        </span>

        <span
          className={cn(
            "ml-4 min-w-0 shrink-0 overflow-hidden font-brand text-md font-semibold leading-5 text-brand",
            "transition-[opacity] duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-40 opacity-100",
          )}
        >
          <span className="line-clamp-2 break-words">{brandLabel}</span>
        </span>
      </div>

      <Tooltip content={toggleLabel} side="right">
        <Button
          type="button"
          variant="ghost"
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          onClick={handleToggleSidebar}
          isDisabled={isTransitioning}
          className={cn(
            "absolute right-0 top-1/2 z-20 size-6 -translate-y-1/2 translate-x-1/2 p-0",
            "border border-line bg-canvas shadow-sm",
            sidebarControlClassNames,
            "aria-expanded:bg-canvas aria-expanded:text-brand aria-expanded:hover:bg-sidebar-accent aria-expanded:hover:text-sidebar-accent-foreground focus-visible:outline-2",
          )}
        >
          <ToggleIcon className="size-4" aria-hidden="true" />
        </Button>
      </Tooltip>
    </div>
  );
};
