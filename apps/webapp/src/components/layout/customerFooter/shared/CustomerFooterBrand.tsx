"use client";

import { customerFooterSocials } from "@/components/layout/customerFooter/customerFooterConfig";
import { CustomerFooterSocialIcon } from "@/components/layout/customerFooter/shared/CustomerFooterSocialIcon";
import { Logo } from "@/components/reusable/Logo";
import { Link } from "@/i18n/navigation";

export const CustomerFooterBrand = ({
  appName,
  description,
}: {
  appName: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
      <Link
        href="/"
        className="w-fit origin-left transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:scale-[1.03]"
      >
        <Logo label={appName} size="lg" textSize="lg" />
      </Link>

      <p className="max-w-64 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="flex items-center gap-2">
        {customerFooterSocials.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-strong transition-colors hover:bg-brand hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <CustomerFooterSocialIcon icon={item.icon} />
          </a>
        ))}
      </div>
    </div>
  );
};
