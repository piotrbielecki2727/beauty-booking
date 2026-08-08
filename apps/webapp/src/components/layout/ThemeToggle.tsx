"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { layoutControlClassNames } from "@/components/layout/layoutControlVariantStyles";
import { Tooltip } from "@/components/reusable/Tooltip";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";

export const ThemeToggle = ({
  variant = "default",
}: {
  variant?: LayoutControlVariant;
}) => {
  const t = useTranslations();
  const isClientHydrated = useClientHydrated();
  const { resolvedTheme, setTheme, theme } = useTheme();

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const title =
    isClientHydrated && theme ? t(`theme.${theme}`) : t("theme.system");

  return (
    <Tooltip content={title} side="bottom">
      <button
        type="button"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2",
          layoutControlClassNames[variant],
        )}
        aria-label={t("theme.toggle")}
        onClick={() => setTheme(nextTheme)}
      >
        {!isClientHydrated || theme === "system" ? (
          <MonitorIcon className="size-5" aria-hidden="true" />
        ) : resolvedTheme === "dark" ? (
          <SunIcon className="size-5" aria-hidden="true" />
        ) : (
          <MoonIcon className="size-5" aria-hidden="true" />
        )}
      </button>
    </Tooltip>
  );
};
