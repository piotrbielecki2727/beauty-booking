"use client";

import { Logo } from "@/components/reusable/Logo";
import { Link } from "@/i18n/navigation";

export const CustomerNavbarBrand = ({ label }: { label: string }) => {
  return (
    <Link
      href="/"
      className="flex min-w-0 origin-left text-nav-foreground transition-transform duration-200 ease-out md:hover:scale-[1.03] md:focus-visible:scale-[1.03]"
    >
      <Logo
        aria-hidden="true"
        label={label}
        size="lg"
        svgClassName="text-nav-brand"
        textSize="lg"
      />
    </Link>
  );
};
