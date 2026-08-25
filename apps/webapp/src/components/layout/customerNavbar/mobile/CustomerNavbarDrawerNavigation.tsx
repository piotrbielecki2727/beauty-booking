"use client";

import { useTranslations } from "next-intl";

import { customerNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerNavbarItem } from "@/components/layout/customerNavbar/shared/CustomerNavbarItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { usePathname } from "@/i18n/navigation";

type CustomerNavbarDrawerNavigationProperties = {
  onNavigate: () => void;
};

export const CustomerNavbarDrawerNavigation = ({
  onNavigate,
}: CustomerNavbarDrawerNavigationProperties) => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav
      className="flex flex-col items-center gap-1"
      aria-label={t("navigation.mobile")}
    >
      {customerNavItems.map((item) => (
        <CustomerNavbarItem
          key={item.href}
          href={item.href}
          isActive={isNavItemActive(pathname, item.href)}
          label={t(`navigation.${item.labelKey}`)}
          onNavigate={onNavigate}
          activeStyle="underline"
        />
      ))}
    </nav>
  );
};

export type { CustomerNavbarDrawerNavigationProperties };
