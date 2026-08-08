"use client";

import { Drawer } from "@base-ui/react/drawer";
import { UserCircleIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { customerNavItems } from "@/components/layout/customerNavbar/customerNavbarConfig";
import { CustomerNavItem } from "@/components/layout/customerNavbar/shared/CustomerNavItem";
import { isNavItemActive } from "@/components/layout/customerNavbar/shared/isNavItemActive";
import { Link, usePathname } from "@/i18n/navigation";

export const CustomerNavbarDrawer = ({ onNavigate }: { onNavigate: () => void }) => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 md:hidden" />

      <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end md:hidden">
        <Drawer.Popup className="h-full w-80 max-w-[85vw] border-l border-nav-border bg-nav p-4 text-nav-foreground shadow-lg outline-none transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <Drawer.Content className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <Drawer.Title className="font-semibold tracking-tight">
                {t("common.appName")}
              </Drawer.Title>
              <Drawer.Close
                className="inline-flex size-10 items-center justify-center rounded-md text-nav-foreground/80 transition-colors hover:bg-nav-accent hover:text-nav-accent-foreground focus-visible:outline-2 focus-visible:outline-nav-ring"
                aria-label={t("navigation.closeMenu")}
              >
                <XIcon className="size-5" aria-hidden="true" />
              </Drawer.Close>
            </div>

            <nav className="flex flex-col gap-1" aria-label={t("navigation.mobile")}>
              {customerNavItems.map((item) => (
                <CustomerNavItem
                  key={item.href}
                  isActive={isNavItemActive(pathname, item.href)}
                  item={item}
                  label={t(`navigation.${item.labelKey}`)}
                  onNavigate={onNavigate}
                  variant="nav"
                />
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-nav-border pt-4">
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="nav" />
                <ThemeToggle variant="nav" />
              </div>
              <Link
                href="/profile"
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-nav-foreground/80 transition-colors hover:bg-nav-accent hover:text-nav-accent-foreground focus-visible:outline-2 focus-visible:outline-nav-ring"
              >
                <UserCircleIcon className="size-5" aria-hidden="true" />
                {t("navigation.profile")}
              </Link>
            </div>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
};
