"use client";

import { Toaster } from "@/components/ui/sonner";

export const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg border border-border bg-card px-4 py-3 font-sans text-card-foreground shadow-lg",
          success:
            "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success",
          error:
            "border-[var(--destructive-border,var(--border))] bg-[var(--destructive-surface,var(--background))] text-destructive",
          warning:
            "border-[var(--status-warning-border,var(--border))] bg-[var(--status-warning-surface,var(--background))] text-warning",
          info: "border-[var(--status-info-border,var(--border))] bg-[var(--status-info-surface,var(--background))] text-info",
          icon: "text-current",
          title: "font-sans text-sm font-semibold leading-5 text-current",
          description: "font-sans text-sm leading-5 text-current opacity-80",
          actionButton:
            "rounded-full bg-primary px-3 py-1 font-sans text-primary-foreground",
          cancelButton:
            "rounded-full bg-muted px-3 py-1 font-sans text-foreground",
        },
      }}
    />
  );
};
