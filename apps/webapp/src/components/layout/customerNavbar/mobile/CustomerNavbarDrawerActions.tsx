"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { customerAuthNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerAccountPanelContent } from "@/components/layout/customerNavbar/shared/CustomerAccountPanelContent";
import { CustomerNavbarItem } from "@/components/layout/customerNavbar/shared/CustomerNavbarItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { LoadingOverlay } from "@/components/reusable";
import { useMinimumVisibleState } from "@/hooks/useMinimumVisibleState";
import { usePathname } from "@/i18n/navigation";

type CustomerNavbarDrawerActionsProperties = {
  onNavigate: () => void;
};

export const CustomerNavbarDrawerActions = ({
  onNavigate,
}: CustomerNavbarDrawerActionsProperties) => {
  const pathname = usePathname();
  const t = useTranslations();
  const { status } = useSession();

  const isSessionLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const shouldShowSessionOverlay = useMinimumVisibleState(isSessionLoading);

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-4">
      {shouldShowSessionOverlay ? <LoadingOverlay variant="bare" /> : null}

      {!isSessionLoading && isAuthenticated ? (
        <CustomerAccountPanelContent onNavigate={onNavigate} />
      ) : null}

      {!isSessionLoading && !isAuthenticated ? (
        <>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="nav" />
            <ThemeToggle variant="nav" />
          </div>

          <nav
            className="flex flex-col gap-1"
            aria-label={t("auth.navigation.label")}
          >
            {customerAuthNavItems.map((item) => (
              <CustomerNavbarItem
                key={item.href}
                href={item.href}
                isActive={isNavItemActive(pathname, item.href)}
                label={t(`auth.navigation.${item.labelKey}`)}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </>
      ) : null}
    </div>
  );
};

export type { CustomerNavbarDrawerActionsProperties };
