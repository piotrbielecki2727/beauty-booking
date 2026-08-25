"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { logoutAccount } from "@/features/account/api";
import { endAccountSession } from "@/features/account/lib";
import { appToast } from "@/features/notifications";

export const useAccountLogout = () => {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      if (session?.accessToken) {
        await logoutAccount(session.accessToken).catch(() => undefined);
      }

      await endAccountSession(`/${locale}`);
    } catch {
      setIsLoggingOut(false);
      appToast.error({
        description: t("accountMenu.logoutErrorDescription"),
        title: t("accountMenu.logoutErrorTitle"),
      });
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};
