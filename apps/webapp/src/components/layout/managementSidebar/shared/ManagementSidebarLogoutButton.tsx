"use client";

import { ChevronRightIcon, LoaderCircleIcon, LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { sidebarControlClassNames } from "@/components/layout/layoutControlVariantStyles";
import { Button, LoadingOverlay } from "@/components/reusable";
import { Tooltip } from "@/components/reusable/Tooltip";
import { useAccountLogout } from "@/features/account/hooks";
import { cn } from "@/lib/utils";

type ManagementSidebarLogoutButtonProperties = {
  isCollapsed?: boolean;
};

export const ManagementSidebarLogoutButton = ({
  isCollapsed = false,
}: ManagementSidebarLogoutButtonProperties) => {
  const t = useTranslations();
  const { handleLogout, isLoggingOut } = useAccountLogout();
  const label = t("accountMenu.logout");
  const Icon = isLoggingOut ? LoaderCircleIcon : LogOutIcon;

  const button = (
    <Button
      type="button"
      variant="ghost"
      aria-label={isCollapsed ? label : undefined}
      aria-busy={isLoggingOut || undefined}
      isDisabled={isLoggingOut}
      onClick={handleLogout}
      className={cn(
        "min-w-0 border border-line bg-canvas",
        sidebarControlClassNames,
        "focus-visible:outline-2",
        "disabled:pointer-events-none disabled:opacity-70",
        isCollapsed
          ? "size-10 justify-center rounded-full p-0"
          : "grid h-12 w-full grid-cols-[2rem_1fr_2rem] rounded-md px-3 text-sm font-medium",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon
          className={cn("size-5", isLoggingOut && "animate-spin")}
          aria-hidden="true"
        />
      </span>

      <span
        className={cn(
          "min-w-0 overflow-hidden whitespace-nowrap text-center",
          isCollapsed && "hidden",
        )}
      >
        {label}
      </span>

      {!isCollapsed ? (
        <ChevronRightIcon className="size-4 justify-self-end" aria-hidden="true" />
      ) : null}
    </Button>
  );

  return (
    <>
      <Tooltip content={label} disabled={!isCollapsed} side="right">
        {button}
      </Tooltip>
      {isLoggingOut ? <LoadingOverlay variant="bare" /> : null}
    </>
  );
};

export type { ManagementSidebarLogoutButtonProperties };
