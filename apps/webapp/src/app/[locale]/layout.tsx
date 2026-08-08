import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { isLocale, routing } from "@/i18n/routing";

import type { ReactNode } from "react";

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
