"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  useAccountSession,
  useAccountSessionActions,
} from "@/features/account/providers/accountProvider";
import type { AccountLoginValues } from "@/features/account/components/login/schemas/accountLoginSchema";
import { findRegisteredAccountByEmail } from "@/features/account/utils/registeredAccountStorage";

const useAccountLoginFlow = () => {
  const router = useRouter();
  const accountSession = useAccountSession();
  const { setAccountSession } = useAccountSessionActions();

  useEffect(() => {
    if (accountSession) {
      router.replace("/");
    }
  }, [accountSession, router]);

  const submitLogin = async (values: AccountLoginValues) => {
    const account = findRegisteredAccountByEmail(values.email);

    if (!account || account.password !== values.password) {
      return {
        ok: false as const,
        message:
          "Nie znaleźliśmy konta z takimi danymi. Sprawdź e-mail i hasło.",
      };
    }

    setAccountSession({
      birthDate: account.birthDate,
      createdAt: new Date().toISOString(),
      email: account.email,
      firstName: account.firstName,
      id: account.id,
      lastName: account.lastName,
      phone: account.phone,
      role: account.role,
    });

    router.replace("/");

    return { ok: true as const };
  };

  return { submitLogin };
};

export { useAccountLoginFlow };
