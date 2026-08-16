"use client";

import { Drawer } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { managementNavItems } from "@/components/layout/managementSidebar/managementSidebarConfig";
import { ManagementNavItem } from "@/components/layout/managementSidebar/shared/ManagementNavItem";
import { isNavItemActive } from "@/components/layout/managementSidebar/shared/isNavItemActive";
import { Logo } from "@/components/reusable/Logo";
import { useTenantContext } from "@/features/tenant";
import { usePathname } from "@/i18n/navigation";

type ManagementSidebarDrawerProperties = {
  onNavigate: () => void;
};

export const ManagementSidebarDrawer = ({
  onNavigate,
}: ManagementSidebarDrawerProperties) => {
  const pathname = usePathname();
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel = business?.name ?? t("common.appName");

  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 z-50 bg-backdrop backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 md:hidden" />

      <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end md:hidden">
        <Drawer.Popup className="h-full w-80 max-w-[85vw] border-l border-line bg-canvas p-4 text-copy shadow-md outline-none transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <Drawer.Content className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <Drawer.Title className="min-w-0">
                <Logo label={brandLabel} size="md" />
              </Drawer.Title>

              <Drawer.Close
                className="inline-flex size-10 items-center justify-center rounded-md text-brand transition-colors hover:bg-surface-hover hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-brand"
                aria-label={t("navigation.closeMenu")}
              >
                <XIcon className="size-5 text-brand" aria-hidden="true" />
              </Drawer.Close>
            </div>

            <nav
              className="flex flex-col gap-1"
              aria-label={t("navigation.management")}
            >
              {managementNavItems.map((item) => (
                <ManagementNavItem
                  key={item.href}
                  isActive={isNavItemActive(pathname, item.href)}
                  item={item}
                  label={t(`navigation.${item.labelKey}`)}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-2 border-t border-line pt-4">
              <LanguageSwitcher variant="sidebar" />
              <ThemeToggle variant="sidebar" />
            </div>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
};
