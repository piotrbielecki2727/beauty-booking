"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { customerAuthNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerAccountMenu } from "@/components/layout/customerNavbar/desktop/CustomerAccountMenu";
import { CustomerNavbarSettingsMenu } from "@/components/layout/customerNavbar/desktop/CustomerNavbarSettingsMenu";
import { CustomerNavbarItem } from "@/components/layout/customerNavbar/shared/CustomerNavbarItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { LoadingOverlay } from "@/components/reusable";
import { useMinimumVisibleState } from "@/hooks/useMinimumVisibleState";
import { usePathname } from "@/i18n/navigation";

export const CustomerNavbarDesktopActions = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const { status } = useSession();

  const isSessionLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const shouldShowSessionOverlay = useMinimumVisibleState(isSessionLoading);

  return (
    <div className="flex shrink-0 items-center gap-2">
      {shouldShowSessionOverlay ? <LoadingOverlay variant="bare" /> : null}

      {!isSessionLoading && !isAuthenticated ? (
        <>
          <nav
            className="flex items-center gap-2 2xl:gap-3"
            aria-label={t("auth.navigation.label")}
          >
            {customerAuthNavItems.map((item) => (
              <CustomerNavbarItem
                key={item.href}
                href={item.href}
                isActive={isNavItemActive(pathname, item.href)}
                label={t(`auth.navigation.${item.labelKey}`)}
                className={item.className}
              />
            ))}
          </nav>
          <CustomerNavbarSettingsMenu />
        </>
      ) : null}

      {!isSessionLoading && isAuthenticated ? <CustomerAccountMenu /> : null}
    </div>
  );
};
