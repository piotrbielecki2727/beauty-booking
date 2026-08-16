"use client";

import { SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DropdownMenu } from "@/components/reusable";

export const CustomerNavbarSettingsMenu = () => {
  const t = useTranslations();

  return (
    <DropdownMenu
      align="end"
      ariaLabel={t("navigation.settings")}
      className="
        size-10
        justify-center
        border-0
        bg-transparent
        px-0
        text-brand
        shadow-none
        outline-none
        hover:bg-brand
        hover:text-copy-inverse
        focus-visible:ring-0
        focus-visible:ring-offset-0
      "
      contentClassName="
        w-56
        min-w-56
        rounded-xl
        border-line
        bg-surface-panel
        p-4
        shadow-lg
      "
      isHoverable
      trigger={<SettingsIcon className="size-5" />}
      sideOffset={8}
    >
      <div className="flex flex-col text-brand">
        <p className="text-sm font-medium">{t("navigation.settings")}</p>

        <div className="my-3 h-px w-full bg-line" />

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs ">{t("settingsMenu.language")}</p>

          <LanguageSwitcher variant="nav" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs ">{t("settingsMenu.theme")}</p>

          <ThemeToggle variant="nav" />
        </div>
      </div>
    </DropdownMenu>
  );
};
