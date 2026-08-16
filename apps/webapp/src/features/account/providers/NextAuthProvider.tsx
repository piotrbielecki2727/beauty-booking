"use client";

import { SessionProvider } from "next-auth/react";

import type { ReactNode } from "react";

type NextAuthProviderProperties = {
  children: ReactNode;
};

export const NextAuthProvider = ({
  children,
}: NextAuthProviderProperties) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  );
};

export type { NextAuthProviderProperties };
