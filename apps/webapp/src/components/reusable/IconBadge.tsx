import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type IconBadgeSize = "sm" | "md" | "lg";
type IconBadgeVariant = "brand" | "neutral";

type IconBadgeProperties = {
  className?: string;
  icon: ReactNode;
  size?: IconBadgeSize;
  variant?: IconBadgeVariant;
};

const sizeClassNames: Record<IconBadgeSize, string> = {
  lg: "size-12 [&_svg]:size-6",
  md: "size-10 [&_svg]:size-5",
  sm: "size-8 [&_svg]:size-4",
};

const variantClassNames: Record<IconBadgeVariant, string> = {
  brand: "bg-brand-soft text-brand",
  neutral: "bg-surface-soft text-copy-muted",
};

export const IconBadge = ({
  className,
  icon,
  size = "md",
  variant = "brand",
}: IconBadgeProperties) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full",
      sizeClassNames[size],
      variantClassNames[variant],
      className,
    )}
  >
    {icon}
  </span>
);

export type { IconBadgeProperties, IconBadgeSize, IconBadgeVariant };
