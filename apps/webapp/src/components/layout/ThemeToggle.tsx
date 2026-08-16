"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { layoutControlClassNames } from "@/components/layout/layoutControlVariantStyles";
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
    <button
      type="button"
      className={cn(
        "group relative inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2",
        layoutControlClassNames[variant],
      )}
      aria-label={t("theme.toggle")}
      title={title}
      onClick={() => setTheme(nextTheme)}
    >
      {!isClientHydrated || theme === "system" ? (
        <MonitorIcon className="size-5" aria-hidden="true" />
      ) : resolvedTheme === "dark" ? (
        <SunIcon className="size-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-5" aria-hidden="true" />
      )}
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-50"
      />
    </button>
  );
};
