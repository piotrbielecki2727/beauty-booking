"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Tooltip } from "@/components/reusable";
import { cn } from "@/lib/utils";

type ManagementSidebarAccountSummaryProperties = {
  isCollapsed: boolean;
};

export const ManagementSidebarAccountSummary = ({
  isCollapsed,
}: ManagementSidebarAccountSummaryProperties) => {
  const { data: session } = useSession();
  const t = useTranslations();
  const user = session?.user;
  const fullName =
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : t("accountMenu.userFallback");
  const roleLabel = user?.role
    ? t(`managementSidebar.account.roles.${user.role}`)
    : undefined;
  const avatarLabel = roleLabel ? `${fullName}, ${roleLabel}` : fullName;
  const avatarImage = user?.image ?? "/womanExample.png";
  const avatarStyle = {
    backgroundImage: `url(${JSON.stringify(avatarImage)})`,
  };

  return (
    <section
      className="flex min-w-0 shrink-0 items-center gap-3 overflow-hidden border-b border-line px-5 py-4"
      aria-label={avatarLabel}
    >
      <Tooltip content={avatarLabel} disabled={!isCollapsed} side="right">
        <span
          className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-brand-soft bg-cover bg-center text-brand"
          aria-label={avatarLabel}
          role="img"
          style={avatarStyle}
        />
      </Tooltip>

      <div
        className={cn(
          "grid min-w-0 shrink-0 gap-1 overflow-hidden transition-[width,opacity] duration-300 ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-40 opacity-100",
        )}
      >
        <p className="truncate font-brand text-sm font-semibold text-brand">
          {fullName}
        </p>
        {user?.email ? (
          <p className="truncate text-xs text-copy-muted">{user.email}</p>
        ) : null}
        {roleLabel ? (
          <span className="mt-1 w-fit rounded-full bg-brand-soft px-2 py-1 text-xs font-medium text-brand">
            {roleLabel}
          </span>
        ) : null}
      </div>
    </section>
  );
};
