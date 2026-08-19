"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useAccountLogout } from "@/features/account/hooks";

const upcomingVisit = {
  date: "14 sierpnia · 17:30",
  title: "Manicure hybrydowy",
};

export const useCustomerAccountMenu = () => {
  const { data: session } = useSession();
  const t = useTranslations();
  const { handleLogout, isLoggingOut } = useAccountLogout();

  const user = session?.user;
  const displayName = user?.firstName ?? t("accountMenu.userFallback");
  const fullName =
    user?.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : displayName;

  return {
    displayName,
    fullName,
    handleLogout,
    isLoggingOut,
    upcomingVisit,
    user,
  };
};
