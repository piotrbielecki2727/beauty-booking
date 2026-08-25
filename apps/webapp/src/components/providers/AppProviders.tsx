"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextAuthProvider } from "@/features/account/providers/NextAuthProvider";
import { AppToaster } from "@/features/notifications";
import { TenantProvider } from "@/features/tenant";

import type { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TenantProvider>
          <TooltipProvider>
            {children}
            <AppToaster />
          </TooltipProvider>
        </TenantProvider>
      </ThemeProvider>
    </NextAuthProvider>
  );
};
