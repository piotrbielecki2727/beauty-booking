"use client";

import { signOut } from "next-auth/react";

let pendingEndAccountSession: Promise<void> | null = null;

export const endAccountSession = async (redirectPath: string) => {
  if (pendingEndAccountSession) {
    return pendingEndAccountSession;
  }

  pendingEndAccountSession = (async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      window.location.replace(redirectPath);
    }
  })();

  return pendingEndAccountSession;
};
