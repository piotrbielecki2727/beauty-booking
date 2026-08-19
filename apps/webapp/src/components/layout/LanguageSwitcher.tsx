"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  layoutControlActiveClassNames,
  layoutControlBorderClassNames,
  layoutControlClassNames,
} from "@/components/layout/layoutControlVariantStyles";
import { Button, LoadingOverlay } from "@/components/reusable";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";
import type { Locale } from "@/i18n/routing";

type LanguageSwitcherProperties = {
  className?: string;
  presentation?: "compact" | "segmented";
  variant?: LayoutControlVariant;
};

export const LanguageSwitcher = ({
  className,
  presentation = "segmented",
  variant = "default",
}: LanguageSwitcherProperties) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const nextLocale =
    routing.locales.find((item) => item !== locale) ?? routing.defaultLocale;

  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale || isPending) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  if (presentation === "compact") {
    const nextLocaleLabel =
      nextLocale === "pl" ? t("common.polish") : t("common.english");

    return (
      <>
        <Button
          type="button"
          variant="ghost"
          isDisabled={isPending}
          onClick={() => changeLocale(nextLocale)}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border bg-canvas p-0",
            "text-xs font-semibold uppercase transition-colors focus-visible:outline-2",
            layoutControlBorderClassNames[variant],
            layoutControlClassNames[variant],
            className,
          )}
          aria-label={nextLocaleLabel}
          title={nextLocaleLabel}
        >
          {locale}
        </Button>
        {isPending ? <LoadingOverlay variant="bare" /> : null}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "inline-grid grid-cols-2 items-center rounded-lg border p-1",
          layoutControlBorderClassNames[variant],
          className,
        )}
      >
        {routing.locales.map((item) => (
          <Button
            key={item}
            type="button"
            variant="ghost"
            isDisabled={isPending}
            onClick={() => changeLocale(item)}
            className={cn(
              "group relative flex h-7 min-w-0 items-center justify-center rounded-md px-2 py-0",
              "text-xs font-medium uppercase",
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-0",
              layoutControlClassNames[variant],
              locale === item &&
                cn(
                  layoutControlActiveClassNames[variant],
                  variant !== "sidebar" && "bg-brand text-copy-inverse",
                ),
            )}
            aria-label={
              item === "pl" ? t("common.polish") : t("common.english")
            }
            aria-pressed={locale === item}
          >
            <span>{item}</span>
            {variant !== "sidebar" ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-1 left-1/2 h-px w-full origin-center -translate-x-1/2 bg-current transition-transform duration-300 ease-out",
                  locale === item
                    ? "scale-x-0"
                    : "scale-x-0 group-hover:scale-x-50",
                )}
              />
            ) : null}
          </Button>
        ))}
      </div>
      {isPending ? <LoadingOverlay variant="bare" /> : null}
    </>
  );
};
