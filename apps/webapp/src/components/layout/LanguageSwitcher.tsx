"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  layoutControlActiveClassNames,
  layoutControlBorderClassNames,
  layoutControlClassNames,
} from "@/components/layout/layoutControlVariantStyles";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";

export const LanguageSwitcher = ({
  variant = "default",
}: {
  variant?: LayoutControlVariant;
}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border p-1",
        layoutControlBorderClassNames[variant],
      )}
    >
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={cn(
            "group relative flex h-7 min-w-8 items-center justify-center rounded-md px-2",
            "text-xs font-medium uppercase",
            "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-0",
            layoutControlClassNames[variant],
            locale === item &&
              cn(layoutControlActiveClassNames[variant], "bg-brand text-copy-inverse"),
          )}
          aria-label={item === "pl" ? t("common.polish") : t("common.english")}
        >
          <span>{item}</span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 bg-current transition-transform duration-300 ease-out",
              locale === item
                ? "scale-x-0"
                : "scale-x-0 group-hover:scale-x-50",
            )}
          />
        </Link>
      ))}
    </div>
  );
};
