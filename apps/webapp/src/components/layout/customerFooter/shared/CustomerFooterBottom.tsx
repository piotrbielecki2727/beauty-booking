"use client";

import { customerFooterLegalLinks } from "@/components/layout/customerFooter/customerFooterConfig";
import { Link } from "@/i18n/navigation";

export const CustomerFooterBottom = ({
  copyright,
  translateLabel,
}: {
  copyright: string;
  translateLabel: (key: string) => string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 border-t border-border py-6 text-center text-xs text-muted-foreground md:flex-row md:justify-between md:text-left">
      <p>{copyright}</p>

      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
        {customerFooterLegalLinks.map((item) => (
          <Link
            key={item.labelKey}
            href={item.href}
            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {translateLabel(`links.${item.labelKey}`)}
          </Link>
        ))}
      </nav>
    </div>
  );
};
