"use client";

import { Drawer } from "@base-ui/react/drawer";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ManagementSidebarDrawer } from "@/components/layout/managementSidebar/mobile/ManagementSidebarDrawer";
import { Logo } from "@/components/reusable/Logo";
import { Link } from "@/i18n/navigation";

type ManagementSidebarMobileProperties = {
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const ManagementSidebarMobile = ({
  isOpen,
  onIsOpenChange,
}: ManagementSidebarMobileProperties) => {
  const t = useTranslations();

  return (
    <header className="flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden">
      <Link href="/management" className="flex min-w-0 items-center gap-2">
        <Logo aria-hidden="true" label={t("common.appName")} size="md" />
      </Link>

      <Drawer.Root open={isOpen} onOpenChange={onIsOpenChange}>
        <Drawer.Trigger
          className="inline-flex size-10 items-center justify-center rounded-md text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring"
          aria-label={t("navigation.openMenu")}
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </Drawer.Trigger>

        <ManagementSidebarDrawer onNavigate={() => onIsOpenChange(false)} />
      </Drawer.Root>
    </header>
  );
};
