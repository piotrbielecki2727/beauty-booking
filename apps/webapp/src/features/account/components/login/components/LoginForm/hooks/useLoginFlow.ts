"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { getDefaultAccountRedirectPath } from "@/features/account/config/roleRoutes";
import { useRouter } from "@/i18n/navigation";

import type { AccountLoginValues } from "@beauty-booking/shared";

export const useLoginFlow = (redirectTo?: string) => {
  const router = useRouter();
  const t = useTranslations();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const submitLogin = async (values: AccountLoginValues) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (typeof result === "string" || !result?.ok || result.error) {
      return {
        isSuccess: false as const,
        message: t("auth.login.feedback.invalidCredentials"),
      };
    }

    setIsRedirecting(true);
    const session = await getSession();
    const defaultRedirectTo = session?.user?.role
      ? getDefaultAccountRedirectPath(session.user.role)
      : "/";

    router.replace(redirectTo ?? defaultRedirectTo);
    router.refresh();

    return { isSuccess: true as const };
  };

  return { isRedirecting, submitLogin };
};
