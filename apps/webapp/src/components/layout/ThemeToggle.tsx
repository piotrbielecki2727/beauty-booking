"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import {
  layoutControlActiveClassNames,
  layoutControlBorderClassNames,
  layoutControlClassNames,
} from "@/components/layout/layoutControlVariantStyles";
import { Button } from "@/components/reusable";
import { Tooltip } from "@/components/reusable/Tooltip";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";

type ThemeToggleProperties = {
  className?: string;
  presentation?: "compact" | "segmented";
  variant?: LayoutControlVariant;
};

const themeOptions = [
  { icon: SunIcon, value: "light" },
  { icon: MoonIcon, value: "dark" },
  { icon: MonitorIcon, value: "system" },
] as const;

export const ThemeToggle = ({
  className,
  presentation = "compact",
  variant = "default",
}: ThemeToggleProperties) => {
  const t = useTranslations();
  const isClientHydrated = useClientHydrated();
  const { resolvedTheme, setTheme, theme } = useTheme();

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const title =
    isClientHydrated && theme ? t(`theme.${theme}`) : t("theme.system");

  if (presentation === "segmented") {
    return (
      <div
        className={cn(
          "inline-grid grid-cols-3 items-center rounded-lg border p-1",
          layoutControlBorderClassNames[variant],
          className,
        )}
        aria-label={t("theme.toggle")}
        role="group"
      >
        {themeOptions.map((item) => {
          const Icon = item.icon;
          const isActive = isClientHydrated && theme === item.value;
          const label = t(`theme.${item.value}`);

          return (
            <Tooltip key={item.value} content={label} side="top">
              <Button
                type="button"
                variant="ghost"
                aria-label={label}
                aria-pressed={isActive}
                isDisabled={!isClientHydrated}
                onClick={() => setTheme(item.value)}
                className={cn(
                  "h-7 w-full min-w-0 rounded-md p-0",
                  layoutControlClassNames[variant],
                  isActive && layoutControlActiveClassNames[variant],
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </Button>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      isDisabled={!isClientHydrated}
      className={cn(
        "group relative inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2",
        layoutControlClassNames[variant],
        className,
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
      {variant !== "sidebar" ? (
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-50"
        />
      ) : null}
    </Button>
  );
};
