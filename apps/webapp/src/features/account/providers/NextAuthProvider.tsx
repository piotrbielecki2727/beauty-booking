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
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  );
};

export type { NextAuthProviderProperties };
