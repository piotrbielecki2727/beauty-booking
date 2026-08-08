import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const isLocale = (value: string): value is Locale =>
  routing.locales.includes(value as Locale);
