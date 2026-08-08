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
  title: ReactNode;
};

export const LoadingOverlay = ({
  className,
  description,
  isOpen = true,
  title,
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
        "fixed inset-0 z-[1000] grid place-items-center bg-background/60 p-6 backdrop-blur-md",
        className,
      )}
      role="status"
    >
      <div className="grid w-full max-w-sm justify-items-center gap-4 rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-lg">
        <span className="relative grid size-20 place-items-center rounded-full bg-secondary/80 text-brand shadow-inner">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-brand/10"
          />
          <span
            aria-hidden="true"
            className="absolute inset-1 animate-spin rounded-full border border-transparent border-r-brand/20 border-t-brand/45 [animation-duration:1.4s]"
          />
          <Logo
            aria-hidden="true"
            className="relative opacity-75"
            size="xl"
          />
        </span>

        <div className="grid gap-2">
          <p className="font-heading text-xl font-semibold">{title}</p>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (!isClientHydrated) {
    return overlay;
  }

  return createPortal(overlay, document.body);
};

export type { LoadingOverlayProperties };
