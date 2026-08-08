"use client";

import { Link } from "@/i18n/navigation";

import type { CustomerFooterSection as CustomerFooterSectionConfig } from "@/components/layout/customerFooter/customerFooterTypes";

export const CustomerFooterSection = ({
  section,
  translateLabel,
}: {
  section: CustomerFooterSectionConfig;
  translateLabel: (key: string) => string;
}) => {
  return (
    <section className="min-w-0 text-center md:text-left">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
        {translateLabel(`sections.${section.labelKey}`)}
      </h2>

      <nav className="mt-4 flex flex-col items-center gap-2 md:items-start">
        {section.links.map((item) => (
          <Link
            key={item.labelKey}
            href={item.href}
            className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {translateLabel(`links.${item.labelKey}`)}
          </Link>
        ))}
      </nav>
    </section>
  );
};
