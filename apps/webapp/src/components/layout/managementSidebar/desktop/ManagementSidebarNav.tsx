"use client";

import { useTranslations } from "next-intl";

import { managementNavItems } from "@/components/layout/managementSidebar/managementSidebarConfig";
import { ManagementNavItem } from "@/components/layout/managementSidebar/shared/ManagementNavItem";
import { isNavItemActive } from "@/components/layout/managementSidebar/shared/isNavItemActive";
import { usePathname } from "@/i18n/navigation";

type ManagementSidebarNavProperties = {
  isCollapsed: boolean;
  isTransitioning: boolean;
};

export const ManagementSidebarNav = ({
  isCollapsed,
  isTransitioning,
}: ManagementSidebarNavProperties) => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav
      className="flex flex-1 flex-col gap-1 p-3"
      aria-label={t("navigation.management")}
    >
      {managementNavItems.map((item) => (
        <ManagementNavItem
          key={item.href}
          isActive={isNavItemActive(pathname, item.href)}
          isCollapsed={isCollapsed || isTransitioning}
          item={item}
          label={t(`navigation.${item.labelKey}`)}
        />
      ))}
    </nav>
  );
};
