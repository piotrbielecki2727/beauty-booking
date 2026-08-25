"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

import { endAccountSession } from "@/features/account/lib";
import {
  BusinessSetupApiError,
  getBusinessSetupStatus,
} from "@/features/businessSetup/api";
import { subscribeToBusinessSetupStatus } from "@/features/businessSetup/businessSetupStatusEvents";

import type { BusinessOnboardingStatus } from "@beauty-booking/shared";

export const useBusinessSetupStatus = () => {
  const locale = useLocale();
  const { data: session, status: sessionStatus } = useSession();
  const [setupStatus, setSetupStatus] =
    useState<BusinessOnboardingStatus | null>(null);
  const [isSetupStatusRequestLoading, setIsSetupStatusRequestLoading] =
    useState(true);
  const [hasSetupStatusError, setHasSetupStatusError] = useState(false);
  const [isRedirectingToLogin, setIsRedirectingToLogin] = useState(false);
  const hasStartedLoginRedirect = useRef(false);
  const accessToken = session?.accessToken;
  const hasMissingAccessToken =
    sessionStatus !== "loading" && !accessToken;

  useEffect(
    () =>
      subscribeToBusinessSetupStatus((status) => {
        setSetupStatus(status);
        setHasSetupStatusError(false);
        setIsSetupStatusRequestLoading(false);
      }),
    [],
  );

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!accessToken) {
      if (!hasStartedLoginRedirect.current) {
        hasStartedLoginRedirect.current = true;
        setIsRedirectingToLogin(true);
        void endAccountSession(`/${locale}/login`);
      }

      return;
    }

    let isMounted = true;

    void getBusinessSetupStatus(accessToken)
      .then((response) => {
        if (isMounted) {
          setSetupStatus(response.status);
          setHasSetupStatusError(false);
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        if (error instanceof BusinessSetupApiError && error.status === 401) {
          if (!hasStartedLoginRedirect.current) {
            hasStartedLoginRedirect.current = true;
            setIsRedirectingToLogin(true);
            void endAccountSession(`/${locale}/login`);
          }
          return;
        }

        setHasSetupStatusError(true);
      })
      .finally(() => {
        if (isMounted) {
          setIsSetupStatusRequestLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, locale, sessionStatus]);

  return {
    hasSetupStatusError:
      hasSetupStatusError && !isRedirectingToLogin,
    isSetupStatusLoading:
      isRedirectingToLogin ||
      hasMissingAccessToken ||
      sessionStatus === "loading" ||
      (Boolean(accessToken) && isSetupStatusRequestLoading),
    setupStatus,
  };
};
