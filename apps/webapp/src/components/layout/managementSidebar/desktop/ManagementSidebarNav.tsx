"use client";

import { useTranslations } from "next-intl";

import { ManagementNavItem } from "@/components/layout/managementSidebar/shared/ManagementNavItem";
import { isNavItemActive } from "@/components/layout/managementSidebar/shared/isNavItemActive";
import { useManagementSetupNavItems } from "@/features/businessSetup/hooks/useManagementSetupNavItems";
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
  const navItems = useManagementSetupNavItems();

  return (
    <nav
      className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3"
      aria-label={t("navigation.management")}
    >
      {navItems.map((item) => (
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
