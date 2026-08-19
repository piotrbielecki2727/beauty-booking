"use client";

import { signOut } from "next-auth/react";

export const endAccountSession = async (redirectPath: string) => {
  await signOut({ redirect: false });
  window.location.replace(redirectPath);
};
