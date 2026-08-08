"use client";

import { Drawer } from "@base-ui/react/drawer";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CustomerNavbarDrawer } from "@/components/layout/customerNavbar/mobile/CustomerNavbarDrawer";

export const CustomerNavbarMobile = ({
  isOpen,
  onIsOpenChange,
}: {
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
}) => {
  const t = useTranslations();

  return (
    <Drawer.Root open={isOpen} onOpenChange={onIsOpenChange} swipeDirection="right">
      <Drawer.Trigger
        className="inline-flex size-10 items-center justify-center rounded-md text-nav-foreground/80 transition-colors hover:bg-nav-accent hover:text-nav-accent-foreground focus-visible:outline-2 focus-visible:outline-nav-ring md:hidden"
        aria-label={t("navigation.openMenu")}
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </Drawer.Trigger>
      <CustomerNavbarDrawer onNavigate={() => onIsOpenChange(false)} />
    </Drawer.Root>
  );
};
