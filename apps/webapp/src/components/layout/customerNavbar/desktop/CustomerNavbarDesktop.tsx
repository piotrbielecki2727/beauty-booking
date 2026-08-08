"use client";

import { UserCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { customerNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerNavItem } from "@/components/layout/customerNavbar/shared/CustomerNavItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { Link, usePathname } from "@/i18n/navigation";

export const CustomerNavbarDesktop = () => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <>
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label={t("navigation.customerMain")}
      >
        {customerNavItems.map((item) => (
          <CustomerNavItem
            key={item.href}
            isActive={isNavItemActive(pathname, item.href)}
            item={item}
            label={t(`navigation.${item.labelKey}`)}
            variant="nav"
          />
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <LanguageSwitcher variant="nav" />
        <ThemeToggle variant="nav" />
        <Link
          href="/profile"
          className="inline-flex size-10 items-center justify-center rounded-md text-nav-foreground/80 transition-colors hover:bg-nav-accent hover:text-nav-accent-foreground focus-visible:outline-2 focus-visible:outline-nav-ring"
          aria-label={t("navigation.profile")}
        >
          <UserCircleIcon className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
};
