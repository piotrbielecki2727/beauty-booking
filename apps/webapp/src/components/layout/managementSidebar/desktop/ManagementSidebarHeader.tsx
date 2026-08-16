"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { getManagementSidebarHeaderState } from "@/components/layout/managementSidebar/desktop/managementSidebarHeaderStyles";
import { Logo } from "@/components/reusable/Logo";
import { Tooltip } from "@/components/reusable/Tooltip";
import { useTenantContext } from "@/features/tenant";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { ManagementSidebarTransition } from "@/components/layout/managementSidebar/managementSidebarTypes";

type ManagementSidebarHeaderProperties = {
  isCollapsed: boolean;
  isSidebarHovered: boolean;
  transition: ManagementSidebarTransition;
};

export const ManagementSidebarHeader = ({
  isCollapsed,
  isSidebarHovered,
  transition,
}: ManagementSidebarHeaderProperties) => {
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel = business?.name ?? t("common.appName");

  const {
    handleCollapseSidebar,
    handleExpandSidebar,
    isCollapsing,
    isExpanding,
    isTransitioning,
  } = transition;

  const {
    brandLabelClassName,
    collapseButtonClassName,
    expandButtonClassName,
    isExpandedIdle,
    logoButtonClassName,
  } = getManagementSidebarHeaderState({
    isCollapsed,
    isCollapsing,
    isExpanding,
    isSidebarHovered,
    isTransitioning,
  });

  return (
    <div className="flex h-16 shrink-0 items-center border-b border-line px-6">
      <div className="relative flex w-full min-w-0 items-center">
        <div
          className={cn(
            "flex min-w-0 origin-left items-center transition-transform duration-200 ease-out",
            isExpandedIdle && "hover:scale-[1.03] focus-within:scale-[1.03]",
          )}
        >
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <Link
              href="/management"
              aria-label={brandLabel}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "transition-[opacity,transform] duration-150 ease-out",
                logoButtonClassName,
              )}
            >
              <Logo aria-hidden="true" size="md" />
            </Link>

            <Tooltip content={t("navigation.expandSidebar")} side="right">
              <button
                type="button"
                aria-label={t("navigation.expandSidebar")}
                onClick={handleExpandSidebar}
                disabled={!isCollapsed || isTransitioning}
                className={cn(
                  "absolute inset-0 inline-flex items-center justify-center",
                  "rounded-md text-brand",
                  "transition-[opacity,transform,color,background-color] duration-150 ease-out",
                  "hover:bg-surface-hover hover:text-brand-hover",
                  "focus-visible:outline-2 focus-visible:outline-brand",
                  expandButtonClassName,
                )}
              >
                <PanelLeftOpenIcon className="size-5" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>

          <Logo
            aria-hidden="true"
            label={brandLabel}
            size="md"
            svgClassName="hidden"
            textSize="md"
            className={cn(
              "ml-2 min-w-0 overflow-hidden whitespace-nowrap text-brand",
              "transition-[opacity,transform] duration-200 ease-out",
              brandLabelClassName,
            )}
          />
        </div>

        <div
          className={cn(
            "absolute right-0 top-1/2 size-9 -translate-y-1/2",
            "transition-opacity duration-150",
            collapseButtonClassName,
          )}
        >
          <Tooltip content={t("navigation.collapseSidebar")} side="right">
            <button
              type="button"
              aria-label={t("navigation.collapseSidebar")}
              onClick={handleCollapseSidebar}
              disabled={isTransitioning}
              className={cn(
                "inline-flex ml-[1.3rem] size-9 items-center justify-center rounded-md",
                "text-brand transition-colors",
                "hover:bg-surface-hover hover:text-brand-hover",
                "focus-visible:outline-2 focus-visible:outline-brand",
              )}
            >
              <PanelLeftCloseIcon className="size-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
