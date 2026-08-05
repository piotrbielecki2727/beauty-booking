"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useAccountSession,
  useAccountSessionActions,
} from "@/features/account/providers/accountProvider";
import type { AccountRegistrationValues } from "@/features/account/components/register/schemas/accountRegistrationSchema";
import type { AccountRegistrationPrefill } from "@/features/account/components/register/types/accountRegistration";
import type { AccountSession } from "@/features/account/types/accountSession";
import { saveRegisteredAccount } from "@/features/account/utils/registeredAccountStorage";
import {
  buildAccountSessionFromRegistration,
  demoVerificationCode,
} from "@/features/account/components/register/utils/accountRegistrationUtils";

const useAccountRegistrationFlow = (
  defaultValues?: AccountRegistrationPrefill,
) => {
  const router = useRouter();
  const accountSession = useAccountSession();
  const { setAccountSession } = useAccountSessionActions();
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [pendingAccountValues, setPendingAccountValues] =
    useState<AccountRegistrationValues>();
  const [verificationTarget, setVerificationTarget] = useState(
    defaultValues?.email ?? "",
  );
  const [createdAccount, setCreatedAccount] = useState<AccountSession>();

  useEffect(() => {
    if (accountSession) {
      router.replace("/");
    }
  }, [accountSession, router]);

  const startVerification = (values: AccountRegistrationValues) => {
    setPendingAccountValues(values);
    setVerificationTarget(values.email.trim());
    setIsVerificationStep(true);
  };

  const resetVerification = () => {
    setIsVerificationStep(false);
    setPendingAccountValues(undefined);
  };

  const finishRegistration = (values: AccountRegistrationValues) => {
    const account = buildAccountSessionFromRegistration(values);

    saveRegisteredAccount({
      ...account,
      password: values.password,
    });
    setAccountSession(account);
    setCreatedAccount(account);
  };

  return {
    createdAccount,
    demoVerificationCode,
    isVerificationStep,
    pendingAccountValues,
    resetVerification,
    setCreatedAccount,
    setIsVerificationStep,
    startVerification,
    verificationTarget,
    finishRegistration,
  };
};

export { useAccountRegistrationFlow };
