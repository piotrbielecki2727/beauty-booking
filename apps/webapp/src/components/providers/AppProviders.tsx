"use client";

import { ChunkLoadRetry } from "@/components/providers/ChunkLoadRetry";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextAuthProvider } from "@/features/account/providers/NextAuthProvider";
import { AppToaster } from "@/features/notifications";
import { TenantProvider } from "@/features/tenant";

import type { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TenantProvider>
            <TooltipProvider>
              <ChunkLoadRetry />
              {children}
              <AppToaster />
            </TooltipProvider>
          </TenantProvider>
        </ThemeProvider>
      </QueryProvider>
    </NextAuthProvider>
  );
};
