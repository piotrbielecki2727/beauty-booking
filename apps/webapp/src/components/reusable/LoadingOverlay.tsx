"use client";

import { createPortal } from "react-dom";

import { Logo } from "@/components/reusable/Logo";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type LoadingOverlayProperties = {
  className?: string;
  description?: ReactNode;
  isOpen?: boolean;
  scope?: "container" | "viewport";
  title?: ReactNode;
  variant?: "card" | "bare";
};

export const LoadingOverlay = ({
  className,
  description,
  isOpen = true,
  scope = "viewport",
  title,
  variant = "card",
}: LoadingOverlayProperties) => {
  const isClientHydrated = useClientHydrated();

  if (!isOpen) {
    return null;
  }

  const overlay = (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "inset-0 grid place-items-center bg-overlay p-6 backdrop-blur-md",
        scope === "viewport" ? "fixed z-[1000]" : "absolute z-30",
        className,
      )}
      role="status"
    >
      <div
        className={cn(
          "grid justify-items-center gap-4 text-center text-copy",
          variant === "card" &&
            "w-full max-w-sm rounded-lg border border-line bg-surface-raised p-6 shadow-lg",
        )}
      >
        <span className="relative grid size-20 place-items-center rounded-full bg-loader-surface text-brand shadow-inner">
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full border border-loader-border",
              variant === "bare" && "shadow-[0_18px_45px] shadow-brand-shadow",
            )}
          />
          <span
            aria-hidden="true"
            className="absolute inset-1 animate-spin rounded-full border border-transparent border-r-loader-spinner-muted border-t-loader-spinner-strong [animation-duration:1.4s]"
          />
          <Logo
            aria-hidden="true"
            className="relative opacity-75"
            size="xl"
          />
        </span>

        {title || description ? (
          <div className="grid gap-2">
            {title ? (
              <p className="font-heading text-xl font-semibold">{title}</p>
            ) : null}
            {description ? (
              <p className="text-sm leading-6 text-copy-muted">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (scope === "container" || !isClientHydrated) {
    return overlay;
  }

  return createPortal(overlay, document.body);
};

export type { LoadingOverlayProperties };
