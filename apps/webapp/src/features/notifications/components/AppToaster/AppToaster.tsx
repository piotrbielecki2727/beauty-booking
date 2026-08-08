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
            "border-success/25 bg-success/10 text-success dark:border-success/35 dark:bg-success/15 dark:text-success",
          error:
            "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/35 dark:bg-destructive/15 dark:text-destructive",
          warning:
            "border-warning/25 bg-warning/10 text-warning dark:border-warning/35 dark:bg-warning/15 dark:text-warning",
          info: "border-info/25 bg-info/10 text-info dark:border-info/35 dark:bg-info/15 dark:text-info",
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
