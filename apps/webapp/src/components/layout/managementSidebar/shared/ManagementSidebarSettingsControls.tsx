"use client";

import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const toggleClassNames = "h-10 w-32";

export const ManagementSidebarSettingsControls = () => {
  const t = useTranslations();

  return (
    <div className="grid gap-1">
      <div className="flex h-11 items-center justify-between px-2">
        <span className="text-xs font-medium text-copy-muted">
          {t("settingsMenu.language")}
        </span>
        <LanguageSwitcher
          className={toggleClassNames}
          variant="sidebar"
        />
      </div>

      <div className="flex h-11 items-center justify-between px-2">
        <span className="text-xs font-medium text-copy-muted">
          {t("settingsMenu.theme")}
        </span>
        <ThemeToggle
          className={toggleClassNames}
          presentation="segmented"
          variant="sidebar"
        />
      </div>
    </div>
  );
};
