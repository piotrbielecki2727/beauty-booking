"use client";

import { usePathname } from "next/navigation";

import { Logo } from "@/components/reusable/Logo";
import { BackgroundSVG } from "@/components/svgs";

const tenantNotFoundCopy = {
  en: {
    appName: "Beauty Booking",
    description:
      "This address is not connected to any salon in Beauty Booking.",
    eyebrow: "Unknown salon",
    hint: "Check the page address or contact the salon owner.",
    title: "We could not find this salon",
  },
  pl: {
    appName: "Beauty Booking",
    description:
      "Ten adres nie jest połączony z żadnym salonem w Beauty Booking.",
    eyebrow: "Nieznany salon",
    hint: "Sprawdź adres strony albo skontaktuj się z właścicielem salonu.",
    title: "Nie znaleźliśmy tego salonu",
  },
} as const;

export const TenantNotFoundState = () => {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pl";
  const copy = tenantNotFoundCopy[locale];

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <BackgroundSVG className="opacity-70" priority />

      <section className="grid w-full max-w-xl justify-items-center gap-8 rounded-2xl border border-border bg-card/90 px-8 py-12 text-center shadow-[0_24px_70px_var(--brand-shadow)] backdrop-blur-sm">
        <Logo
          className="text-brand"
          label={copy.appName}
          size="xl"
          textSize="lg"
        />

        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
            {copy.eyebrow}
          </p>
          <h1 className="font-brand text-4xl font-semibold text-brand md:text-5xl">
            {copy.title}
          </h1>
          <p className="mx-auto max-w-md leading-7 text-muted-foreground">
            {copy.description}
          </p>
        </div>

        <p className="max-w-md border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          {copy.hint}
        </p>
      </section>
    </main>
  );
};
