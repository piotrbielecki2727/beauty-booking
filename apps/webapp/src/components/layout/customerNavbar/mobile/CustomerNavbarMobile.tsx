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
    <Drawer.Root
      open={isOpen}
      onOpenChange={onIsOpenChange}
      swipeDirection="right"
    >
      <Drawer.Trigger
        className="inline-flex size-10 items-center justify-center rounded-md text-brand transition-colors hover:bg-transparent hover:scale-[1.1] hover: transition-transform duration-300 ease-out focus-visible:outline-2 focus-visible:outline-nav-ring xl:hidden cursor-pointer"
        aria-label={t("navigation.openMenu")}
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </Drawer.Trigger>
      <CustomerNavbarDrawer onNavigate={() => onIsOpenChange(false)} />
    </Drawer.Root>
  );
};
