"use client";

import { Drawer } from "@base-ui/react/drawer";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { sidebarControlClassNames } from "@/components/layout/layoutControlVariantStyles";
import { ManagementSidebarDrawer } from "@/components/layout/managementSidebar/mobile/ManagementSidebarDrawer";
import { Logo } from "@/components/reusable/Logo";
import { useTenantContext } from "@/features/tenant";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ManagementSidebarMobileProperties = {
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const ManagementSidebarMobile = ({
  isOpen,
  onIsOpenChange,
}: ManagementSidebarMobileProperties) => {
  const t = useTranslations();
  const { business } = useTenantContext();
  const brandLabel = business?.name ?? t("common.appName");

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-canvas px-4 text-copy md:hidden">
      <Link href="/management" className="flex min-w-0 items-center gap-2">
        <Logo aria-hidden="true" label={brandLabel} size="md" />
      </Link>

      <Drawer.Root open={isOpen} onOpenChange={onIsOpenChange}>
        <Drawer.Trigger
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-md focus-visible:outline-2",
            sidebarControlClassNames,
          )}
          aria-label={t("navigation.openMenu")}
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </Drawer.Trigger>

        <ManagementSidebarDrawer onNavigate={() => onIsOpenChange(false)} />
      </Drawer.Root>
    </header>
  );
};
