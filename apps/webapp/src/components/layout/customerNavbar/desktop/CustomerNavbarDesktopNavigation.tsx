"use client";

import { useTranslations } from "next-intl";

import { customerNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerNavbarItem } from "@/components/layout/customerNavbar/shared/CustomerNavbarItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { usePathname } from "@/i18n/navigation";

export const CustomerNavbarDesktopNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav
      className="flex min-w-0 items-center gap-5 2xl:gap-10"
      aria-label={t("navigation.customerMain")}
    >
      {customerNavItems.map((item) => (
        <CustomerNavbarItem
          key={item.href}
          activeStyle="underline"
          href={item.href}
          isActive={isNavItemActive(pathname, item.href)}
          label={t(`navigation.${item.labelKey}`)}
        />
      ))}
    </nav>
  );
};
