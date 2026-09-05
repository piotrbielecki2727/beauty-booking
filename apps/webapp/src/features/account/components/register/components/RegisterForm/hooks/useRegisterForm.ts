"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  accountRegistrationSchema,
  accountVerificationCodeSchema,
  type AccountRegistrationValues,
  type AccountVerificationCodeValues,
  type AuthRegistrationFlowResponse,
} from "@beauty-booking/shared";

import {
  AccountAuthApiError,
  cancelAccountRegistration,
  registerAccount,
  resendAccountRegistrationCode,
  resumeAccountRegistration,
  verifyAccountEmail,
} from "@/features/account/api";
import {
  clearStoredRegistrationToken,
  getStoredRegistrationToken,
  storeRegistrationToken,
} from "@/features/account/components/register/utils";
import { getAuthRedirectQuery } from "@/features/account/lib";
import { appToast } from "@/features/notifications/lib";
import { useRouter } from "@/i18n/navigation";

import type { UseFormReturn } from "react-hook-form";

type UseRegisterFormReturn = {
  codeExpiresText?: string;
  confirmedEmail?: string;
  detailsForm: UseFormReturn<AccountRegistrationValues>;
  handleBack: () => Promise<void>;
  isCancellingRegistration: boolean;
  isCodeExpired: boolean;
  isInitializing: boolean;
  isRedirectingToVerification: boolean;
  isResendDisabled: boolean;
  isResendingCode: boolean;
  isVerificationStep: boolean;
  resendCooldownText?: string;
  resendLimitText?: string;
  resendRegistrationCode: () => Promise<void>;
  submitAccountDetails: (values: AccountRegistrationValues) => Promise<void>;
  submitVerificationCode: (
    values: AccountVerificationCodeValues,
  ) => Promise<void>;
  verificationForm: UseFormReturn<AccountVerificationCodeValues>;
  verificationTarget: string;
};

type RegisterFormMode = "register" | "verify";

const isRegistrationGoneError = (error: unknown) => {
  return error instanceof AccountAuthApiError && error.status === 410;
};

const getSecondsUntil = (dateValue: string | null, now: number) => {
  if (!dateValue) {
    return 0;
  }

  return Math.max(0, Math.ceil((new Date(dateValue).getTime() - now) / 1000));
};

const formatCodeCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

export const useRegisterForm = (
  mode: RegisterFormMode,
  redirectTo?: string,
): UseRegisterFormReturn => {
  const router = useRouter();
  const t = useTranslations();
  const authRedirectQuery = getAuthRedirectQuery(redirectTo);
  const [canResendAt, setCanResendAt] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);
  const [confirmedEmail, setConfirmedEmail] = useState<string>();
  const [isCancellingRegistration, setIsCancellingRegistration] =
    useState(false);
  const [isInitializing, setIsInitializing] = useState(mode === "verify");
  const [isRedirectingToVerification, setIsRedirectingToVerification] =
    useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [registrationToken, setRegistrationToken] = useState("");
  const [remainingResends, setRemainingResends] = useState(0);
  const [verificationTarget, setVerificationTarget] = useState("");

  const detailsForm = useForm<AccountRegistrationValues>({
    defaultValues: {
      acceptTermsAndPrivacyPolicy: false,
      birthDate: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phone: "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountRegistrationSchema),
  });

  const verificationForm = useForm<AccountVerificationCodeValues>({
    defaultValues: {
      code: "",
    },
    mode: "onTouched",
    resolver: zodResolver(accountVerificationCodeSchema),
  });
  const { reset: resetVerificationForm } = verificationForm;

  const getRegisterFormErrorMessage = useCallback(
    (error: unknown) => {
      if (error instanceof AccountAuthApiError) {
        if (error.message && error.message !== error.code) {
          return error.message;
        }

        return t(`api.account.${error.code}`);
      }

      return error instanceof Error
        ? error.message
        : t("auth.register.feedback.genericError");
    },
    [t],
  );

  const resetRegistrationState = useCallback(() => {
    clearStoredRegistrationToken();
    setRegistrationToken("");
    setVerificationTarget("");
    setCodeExpiresAt(null);
    setCanResendAt(null);
    setRemainingResends(0);
    setIsVerificationStep(false);
    resetVerificationForm({ code: "" });
  }, [resetVerificationForm]);

  const applyRegistrationResponse = useCallback(
    (response: AuthRegistrationFlowResponse, fallbackEmail?: string) => {
      if (response.verificationRequired) {
        storeRegistrationToken(response.registrationToken);
        setRegistrationToken(response.registrationToken);
        setVerificationTarget(response.email);
        setCodeExpiresAt(response.codeExpiresAt);
        setCanResendAt(response.canResendAt);
        setRemainingResends(response.remainingResends);
        setConfirmedEmail(undefined);
        setIsVerificationStep(true);
        return;
      }

      resetRegistrationState();

      if (response.status === "VERIFIED") {
        setConfirmedEmail(response.email ?? fallbackEmail);
        return;
      }

      if (response.status === "REGISTRATION_EXPIRED") {
        appToast.warning({
          description: t(
            "auth.register.feedback.registrationExpiredDescription",
          ),
          title: t("auth.register.feedback.registrationExpired"),
        });
        return;
      }

      appToast.info({
        description: t("auth.register.feedback.resumeRegistrationDescription"),
        title: t("auth.register.feedback.cannotResume"),
      });
    },
    [resetRegistrationState, t],
  );

  useEffect(() => {
    if (mode === "register" && getStoredRegistrationToken()) {
      router.replace(`/register/verify${authRedirectQuery}`);
      return;
    }

    if (mode !== "verify") {
      return;
    }

    let isActive = true;

    const resumeRegistration = async () => {
      const storedRegistrationToken = getStoredRegistrationToken();

      if (!storedRegistrationToken) {
        router.replace(`/register${authRedirectQuery}`);
        return;
      }

      try {
        const response = await resumeAccountRegistration({
          registrationToken: storedRegistrationToken,
        });

        if (!isActive) {
          return;
        }

        applyRegistrationResponse(response);

        if (!response.verificationRequired && response.status !== "VERIFIED") {
          router.replace(`/register${authRedirectQuery}`);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        clearStoredRegistrationToken();
        appToast.error({
          description: getRegisterFormErrorMessage(error),
          title: t("auth.register.feedback.resumeRegistrationFailed"),
        });
        router.replace(`/register${authRedirectQuery}`);
      }
    };

    void resumeRegistration().finally(() => {
      if (isActive) {
        setIsInitializing(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [
    applyRegistrationResponse,
    authRedirectQuery,
    getRegisterFormErrorMessage,
    mode,
    router,
    t,
  ]);

  useEffect(() => {
    if (!isVerificationStep) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, [isVerificationStep]);

  const submitAccountDetails = async (values: AccountRegistrationValues) => {
    try {
      resetVerificationForm({ code: "" });
      const response = await registerAccount(values);

      if (response.verificationRequired) {
        storeRegistrationToken(response.registrationToken);
        setIsRedirectingToVerification(true);
        router.replace(`/register/verify${authRedirectQuery}`);
        return;
      }

      applyRegistrationResponse(response, values.email.trim());
    } catch (error) {
      appToast.error({
        description: getRegisterFormErrorMessage(error),
        title: t("auth.register.feedback.registrationFailed"),
      });
    }
  };

  const handleBack = async () => {
    setIsCancellingRegistration(true);

    if (registrationToken) {
      await cancelAccountRegistration({ registrationToken }).catch(() => {
        appToast.warning({
          description: t(
            "auth.register.feedback.registrationClearedDescription",
          ),
          title: t("auth.register.feedback.registrationCleared"),
        });
      });
    }

    clearStoredRegistrationToken();
    router.replace(`/register${authRedirectQuery}`);
  };

  const submitVerificationCode = async (
    values: AccountVerificationCodeValues,
  ) => {
    if (!registrationToken) {
      await handleBack();
      return;
    }

    try {
      const response = await verifyAccountEmail({
        code: values.code,
        registrationToken,
      });

      resetRegistrationState();
      setConfirmedEmail(response.email);
    } catch (error) {
      const message = getRegisterFormErrorMessage(error);

      if (isRegistrationGoneError(error)) {
        resetRegistrationState();
        appToast.warning({
          description: message,
          title: t("auth.register.feedback.registrationExpired"),
        });
        router.replace(`/register${authRedirectQuery}`);
        return;
      }

      verificationForm.setError("code", {
        message,
        type: "validate",
      });
      appToast.error({
        description: message,
        title: t("auth.register.feedback.emailConfirmationFailed"),
      });
    }
  };

  const resendRegistrationCode = async () => {
    if (!registrationToken) {
      return;
    }

    try {
      setIsResendingCode(true);
      const response = await resendAccountRegistrationCode({
        registrationToken,
      });

      resetVerificationForm({ code: "" });
      applyRegistrationResponse(response, verificationTarget);

      if (response.verificationRequired) {
        appToast.success({
          description: t(
            "auth.register.feedback.verificationCodeSentDescription",
          ),
          title: t("auth.register.feedback.verificationCodeSent"),
        });
      }
    } catch (error) {
      if (isRegistrationGoneError(error)) {
        resetRegistrationState();
        appToast.warning({
          description: getRegisterFormErrorMessage(error),
          title: t("auth.register.feedback.registrationExpired"),
        });
        router.replace(`/register${authRedirectQuery}`);
        return;
      }

      appToast.error({
        description: getRegisterFormErrorMessage(error),
        title: t("auth.register.feedback.resendCodeFailed"),
      });
    } finally {
      setIsResendingCode(false);
    }
  };

  const codeSecondsLeft = getSecondsUntil(codeExpiresAt, now);
  const cooldownSecondsLeft = getSecondsUntil(canResendAt, now);
  const isCodeExpired = isVerificationStep && codeSecondsLeft === 0;
  const codeExpiresText =
    isVerificationStep && !isCodeExpired
      ? t("auth.register.feedback.codeExpires", {
          time: formatCodeCountdown(codeSecondsLeft),
        })
      : undefined;
  const resendCooldownText =
    cooldownSecondsLeft > 0
      ? t("auth.register.feedback.resendCooldown", {
          seconds: cooldownSecondsLeft,
        })
      : undefined;
  const resendLimitText =
    isVerificationStep && remainingResends === 0
      ? t("auth.register.feedback.resendLimitReached")
      : undefined;

  return {
    codeExpiresText,
    confirmedEmail,
    detailsForm,
    handleBack,
    isCancellingRegistration,
    isCodeExpired,
    isInitializing,
    isRedirectingToVerification,
    isResendDisabled:
      isResendingCode || cooldownSecondsLeft > 0 || remainingResends === 0,
    isResendingCode,
    isVerificationStep,
    resendCooldownText,
    resendLimitText,
    resendRegistrationCode,
    submitAccountDetails,
    submitVerificationCode,
    verificationForm,
    verificationTarget,
  };
};

export type { RegisterFormMode, UseRegisterFormReturn };
