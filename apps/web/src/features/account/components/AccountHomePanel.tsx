"use client";

import { AccountHomeLoading } from "@/features/account/components/home/AccountHomeLoading";
import { AccountLanding } from "@/features/account/components/home/AccountLanding";
import {
  CustomerHome,
  SalonTeamHome,
} from "@/features/account/components/home/components";
import { useAccountSession } from "@/features/account/hooks/useAccountSession";
import { isSalonTeamRole } from "@/features/account/utils/accountRoleGuards";
import { useClientHydrated } from "@/hooks/use-client-hydrated";

const AccountHomePanel = () => {
  const accountSession = useAccountSession();
  const isHydrated = useClientHydrated();

  if (!isHydrated) {
    return <AccountHomeLoading />;
  }

  if (!accountSession) {
    return <AccountLanding />;
  }

  if (isSalonTeamRole(accountSession.role)) {
    return <SalonTeamHome accountSession={accountSession} />;
  }

  return <CustomerHome accountSession={accountSession} />;
};

export { AccountHomePanel };
