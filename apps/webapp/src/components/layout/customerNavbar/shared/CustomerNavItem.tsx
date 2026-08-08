"use client";

import {
  layoutControlActiveClassNames,
  layoutControlClassNames,
} from "@/components/layout/layoutControlVariantStyles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";
import type { CustomerNavItemConfig } from "@/components/layout/customerNavbar/customerNavbarTypes";

type CustomerNavItemVariant = Exclude<LayoutControlVariant, "sidebar">;

export const CustomerNavItem = ({
  className,
  isActive,
  item,
  label,
  onNavigate,
  variant = "default",
}: {
  className?: string;
  isActive: boolean;
  item: CustomerNavItemConfig;
  label: string;
  onNavigate?: () => void;
  variant?: CustomerNavItemVariant;
}) => {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2",
        layoutControlClassNames[variant],
        isActive && layoutControlActiveClassNames[variant],
        className,
      )}
    >
      {label}
    </Link>
  );
};
