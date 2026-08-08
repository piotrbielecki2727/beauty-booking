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
        "inline-flex rounded-md border p-1",
        layoutControlBorderClassNames[variant],
      )}
    >
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium uppercase transition-colors focus-visible:outline-2",
            layoutControlClassNames[variant],
            locale === item && layoutControlActiveClassNames[variant],
          )}
          aria-label={item === "pl" ? t("common.polish") : t("common.english")}
        >
          {item}
        </Link>
      ))}
    </div>
  );
};
