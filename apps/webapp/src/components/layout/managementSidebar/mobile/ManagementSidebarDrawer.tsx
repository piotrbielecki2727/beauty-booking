"use client";

import { Drawer } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { sidebarControlClassNames } from "@/components/layout/layoutControlVariantStyles";
import {
  managementNavItems,
  managementSetupNavItems,
} from "@/components/layout/managementSidebar/managementSidebarConfig";
import { ManagementNavItem } from "@/components/layout/managementSidebar/shared/ManagementNavItem";
import { ManagementSidebarLogoutButton } from "@/components/layout/managementSidebar/shared/ManagementSidebarLogoutButton";
import { ManagementSidebarSettingsControls } from "@/components/layout/managementSidebar/shared/ManagementSidebarSettingsControls";
import { isNavItemActive } from "@/components/layout/managementSidebar/shared/isNavItemActive";
import { Logo } from "@/components/reusable/Logo";
import { useTenantContext } from "@/features/tenant";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ManagementSidebarDrawerProperties = {
  isSetupMode: boolean;
  onNavigate: () => void;
};

export const ManagementSidebarDrawer = ({
  isSetupMode,
  onNavigate,
}: ManagementSidebarDrawerProperties) => {
  const pathname = usePathname();
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel =
    !isSetupMode && business?.name ? business.name : t("common.appName");
  const navItems = isSetupMode ? managementSetupNavItems : managementNavItems;

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
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-md focus-visible:outline-2",
                  sidebarControlClassNames,
                )}
                aria-label={t("navigation.closeMenu")}
              >
                <XIcon className="size-5" aria-hidden="true" />
              </Drawer.Close>
            </div>

            <nav
              className="flex flex-col gap-1"
              aria-label={t("navigation.management")}
            >
              {navItems.map((item) => (
                <ManagementNavItem
                  key={item.href}
                  isActive={isNavItemActive(pathname, item.href)}
                  item={item}
                  label={t(`navigation.${item.labelKey}`)}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>

            <div className="mt-auto grid gap-3 border-t border-line pt-4">
              <ManagementSidebarSettingsControls />
              <div className="h-px w-full bg-line" aria-hidden="true" />
              <ManagementSidebarLogoutButton />
            </div>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
};
