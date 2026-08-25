"use client";

import { Drawer } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CustomerNavbarDrawerActions } from "@/components/layout/customerNavbar/mobile/CustomerNavbarDrawerActions";
import { CustomerNavbarDrawerNavigation } from "@/components/layout/customerNavbar/mobile/CustomerNavbarDrawerNavigation";
import { useTenantContext } from "@/features/tenant";

type CustomerNavbarDrawerProperties = {
  onNavigate: () => void;
};

export const CustomerNavbarDrawer = ({
  onNavigate,
}: CustomerNavbarDrawerProperties) => {
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel = business?.name ?? t("common.appName");

  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 z-50 bg-backdrop backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 xl:hidden" />
      <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end xl:hidden">
        <Drawer.Popup className="h-full w-80 max-w-[85vw] border-l border-line bg-canvas p-4 shadow-md outline-none transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <Drawer.Content className="flex h-full flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between gap-4">
              <span className="font-brand text-[28px] font-semibold leading-[28px] tracking-[-0.02em] text-brand">
                {brandLabel}
              </span>
              <Drawer.Close
                className="inline-flex size-10 items-center justify-center rounded-md text-copy-muted transition-colors hover:bg-surface-hover hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
                aria-label={t("navigation.closeMenu")}
              >
                <XIcon className="size-5 text-brand" aria-hidden="true" />
              </Drawer.Close>
            </div>

            <CustomerNavbarDrawerNavigation onNavigate={onNavigate} />
            <CustomerNavbarDrawerActions onNavigate={onNavigate} />
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
};

export type { CustomerNavbarDrawerProperties };
