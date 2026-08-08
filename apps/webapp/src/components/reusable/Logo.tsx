import { BeautyBookingLogoSvg } from "@/components/svgs";
import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type LogoTextSize = "sm" | "md" | "lg";

const logoSizeClassName: Record<LogoSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
  "2xl": "size-16",
  "3xl": "size-20",
  "4xl": "size-24",
};

const logoTextSizeClassName: Record<LogoTextSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

type LogoProperties = Omit<ComponentPropsWithoutRef<"span">, "color"> & {
  color?: string;
  label?: ReactNode;
  labelClassName?: string;
  size?: LogoSize;
  svgClassName?: string;
  textSize?: LogoTextSize;
};

export const Logo = ({
  className,
  color,
  label,
  labelClassName,
  size = "md",
  style,
  svgClassName,
  textSize = "md",
  ...props
}: LogoProperties) => {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2",
        className,
      )}
      style={style}
      {...props}
    >
      <BeautyBookingLogoSvg
        aria-hidden="true"
        className={cn("text-brand", logoSizeClassName[size], svgClassName)}
        focusable="false"
        style={{ color }}
      />
      {label && (
        <span
          className={cn(
            "truncate font-brand font-semibold tracking-tight",
            logoTextSizeClassName[textSize],
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
};
