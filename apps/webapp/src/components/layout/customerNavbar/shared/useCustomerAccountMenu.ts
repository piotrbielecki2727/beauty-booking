"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { logoutAccount } from "@/features/account/api";
import { appToast } from "@/features/notifications";

const upcomingVisit = {
  date: "14 sierpnia · 17:30",
  title: "Manicure hybrydowy",
};

export const useCustomerAccountMenu = () => {
  const { data: session } = useSession();
  const t = useTranslations();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;
  const displayName = user?.firstName ?? t("accountMenu.userFallback");
  const fullName =
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : displayName;

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      if (session?.accessToken) {
        await logoutAccount(session.accessToken).catch(() => undefined);
      }

      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch {
      setIsLoggingOut(false);
      appToast.error({
        description: t("accountMenu.logoutErrorDescription"),
        title: t("accountMenu.logoutErrorTitle"),
      });
    }
  };

  return {
    displayName,
    fullName,
    handleLogout,
    isLoggingOut,
    upcomingVisit,
    user,
  };
};
