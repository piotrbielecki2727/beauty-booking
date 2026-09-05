"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";

import type { ReactNode } from "react";

type QueryProviderProperties = {
  children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProperties) => (
  <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
);

export type { QueryProviderProperties };
