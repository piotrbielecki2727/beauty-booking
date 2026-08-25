"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { CustomerAccountPanelContent } from "@/components/layout/customerNavbar/shared/CustomerAccountPanelContent";
import { useCustomerAccountMenu } from "@/components/layout/customerNavbar/shared/useCustomerAccountMenu";
import { DropdownMenu } from "@/components/reusable";

export const CustomerAccountMenu = () => {
  const t = useTranslations();
  const { displayName } = useCustomerAccountMenu();

  return (
    <DropdownMenu
      align="end"
      ariaLabel={t("accountMenu.label")}
      className="group h-12 w-auto gap-3 rounded-2xl bg-brand px-4 text-copy-inverse shadow-sm hover:border-brand-border hover:bg-transparent hover:text-brand"
      contentClassName="w-72 rounded-2xl border-line bg-surface-panel p-5 shadow-xl"
      sideOffset={10}
      trigger={(isOpen) => (
        <>
          <span className="grid size-7 place-items-center rounded-full border border-copy-inverse transition-colors group-hover:border-brand">
            <UserRoundIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="max-w-24 truncate text-sm font-medium">
            {displayName}
          </span>
          {isOpen ? (
            <ChevronUpIcon className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="size-4" aria-hidden="true" />
          )}
        </>
      )}
    >
      <CustomerAccountPanelContent />
    </DropdownMenu>
  );
};
