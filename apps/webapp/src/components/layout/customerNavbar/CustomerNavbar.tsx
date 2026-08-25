"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { CustomerNavbarDesktop } from "@/components/layout/customerNavbar/desktop/CustomerNavbarDesktop";
import { CustomerNavbarMobile } from "@/components/layout/customerNavbar/mobile/CustomerNavbarMobile";
import { useTenantContext } from "@/features/tenant";

export const CustomerNavbar = () => {
  const t = useTranslations();
  const { business } = useTenantContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const brandLabel = business?.name ?? t("common.appName");

  return (
    <header className="sticky top-0 z-40 bg-canvas">
      <div className="flex h-18 items-center justify-between gap-4 border-b border-line px-4 py-0 sm:px-6 lg:px-12">
        <span className="font-brand text-[28px] font-semibold leading-[28px] tracking-[-0.02em] text-brand">
          {brandLabel}
        </span>
        <CustomerNavbarDesktop />
        <CustomerNavbarMobile
          isOpen={isMobileOpen}
          onIsOpenChange={setIsMobileOpen}
        />
      </div>
    </header>
  );
};
