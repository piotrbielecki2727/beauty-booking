"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/PageContainer";
import { CustomerNavbarDesktop } from "@/components/layout/customerNavbar/desktop/CustomerNavbarDesktop";
import { CustomerNavbarMobile } from "@/components/layout/customerNavbar/mobile/CustomerNavbarMobile";
import { CustomerNavbarBrand } from "@/components/layout/customerNavbar/shared/CustomerNavbarBrand";

export const CustomerNavbar = () => {
  const t = useTranslations();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-nav-border bg-nav/95 text-nav-foreground ">
      <PageContainer className="flex h-16 items-center justify-between gap-4 py-0">
        <CustomerNavbarBrand label={t("common.appName")} />
        <CustomerNavbarDesktop />
        <CustomerNavbarMobile
          isOpen={isMobileOpen}
          onIsOpenChange={setIsMobileOpen}
        />
      </PageContainer>
    </header>
  );
};
