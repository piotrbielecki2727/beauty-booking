"use client";

import {
  layoutControlActiveClassNames,
  layoutControlClassNames,
} from "@/components/layout/layoutControlVariantStyles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { LayoutControlVariant } from "@/components/layout/layoutControlVariantStyles";

type CustomerNavbarItemVariant = Exclude<LayoutControlVariant, "sidebar">;

type CustomerNavbarItemProperties = {
  activeStyle?: "surface" | "underline";
  className?: string;
  href: string;
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
  variant?: CustomerNavbarItemVariant;
};

const customerNavbarItemBaseClassName =
  "group relative inline-flex items-center justify-center py-2.5 text-sm font-medium tracking-widest transition-colors focus-visible:outline-2";

const customerNavbarItemStyleClassNames = {
  surface: "rounded-md px-3",
  underline: "w-fit px-0 hover:bg-transparent",
};

const customerNavbarUnderlineClassName =
  "absolute -bottom-0.5 left-1/2 h-px w-full origin-center -translate-x-1/2 bg-current transition-transform duration-300 ease-out";

export const CustomerNavbarItem = ({
  activeStyle = "surface",
  className,
  href,
  isActive,
  label,
  onNavigate,
  variant = "nav",
}: CustomerNavbarItemProperties) => {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        customerNavbarItemBaseClassName,
        layoutControlClassNames[variant],
        customerNavbarItemStyleClassNames[activeStyle],
        activeStyle === "surface" &&
          isActive &&
          layoutControlActiveClassNames[variant],
        className,
      )}
    >
      <span>{label}</span>
      {activeStyle === "underline" ? (
        <span
          aria-hidden="true"
          className={cn(
            customerNavbarUnderlineClassName,
            isActive ? "scale-x-50" : "scale-x-0 group-hover:scale-x-50",
          )}
        />
      ) : null}
    </Link>
  );
};

export type { CustomerNavbarItemProperties };
