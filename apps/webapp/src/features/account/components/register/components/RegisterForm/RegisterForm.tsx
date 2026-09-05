"use client";

import { FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Card, LoadingOverlay } from "@/components";
import { cn } from "@/lib/utils";

import { RegisterFormDataStep } from "../RegisterFormDataStep";
import { RegisterFormSuccessState } from "../RegisterFormSuccessState";
import { RegisterFormVerificationStep } from "../RegisterFormVerificationStep";
import { useRegisterForm, type RegisterFormMode } from "./hooks";

type RegisterFormProperties = {
  mode?: RegisterFormMode;
  redirectTo?: string;
};

const registerFormCardClassName =
  "w-full border-line-subtle bg-surface-raised shadow-lg shadow-brand-shadow";
const registerFormDataCardClassName =
  "w-full border-0 bg-transparent py-0 shadow-none ring-0 [--card-spacing:--spacing(0)]";

export const RegisterForm = ({
  mode = "register",
  redirectTo,
}: RegisterFormProperties) => {
  const t = useTranslations();
  const {
    codeExpiresText,
    confirmedEmail,
    detailsForm,
    handleBack,
    isCancellingRegistration,
    isCodeExpired,
    isInitializing,
    isRedirectingToVerification,
    isResendDisabled,
    isResendingCode,
    isVerificationStep,
    resendCooldownText,
    resendLimitText,
    resendRegistrationCode,
    submitAccountDetails,
    submitVerificationCode,
    verificationForm,
    verificationTarget,
  } = useRegisterForm(mode, redirectTo);

  const isVerifyMode = mode === "verify";
  const pageTitle = confirmedEmail
    ? t("auth.register.hero.confirmedTitle")
    : isVerifyMode
      ? t("auth.register.hero.verifyTitle")
      : t("auth.register.hero.title");
  const pageDescription = confirmedEmail
    ? t("auth.register.hero.confirmedDescription")
    : t("auth.register.hero.description");
  const shouldShowPageHero = !isVerifyMode || Boolean(confirmedEmail);
  const contentClassName =
    isVerifyMode && !confirmedEmail
      ? "grid w-full max-w-md gap-6"
      : "grid w-full max-w-xl gap-6";
  const shouldShowVerificationStatusOverlay =
    isVerifyMode && !confirmedEmail && (isInitializing || !isVerificationStep);

  const renderCurrentRegisterStep = () => {
    if (confirmedEmail) {
      return (
        <RegisterFormSuccessState
          email={confirmedEmail}
          redirectTo={redirectTo}
        />
      );
    }

    if (isVerifyMode) {
      if (!isVerificationStep) {
        return null;
      }

      return (
        <FormProvider {...verificationForm}>
          <RegisterFormVerificationStep
            codeExpiresText={codeExpiresText}
            isCodeExpired={isCodeExpired}
            isResendDisabled={isResendDisabled}
            isResendingCode={isResendingCode}
            onBack={handleBack}
            onResendCode={resendRegistrationCode}
            onSubmit={submitVerificationCode}
            resendCooldownText={resendCooldownText}
            resendLimitText={resendLimitText}
            verificationTarget={verificationTarget}
          />
        </FormProvider>
      );
    }

    return (
      <FormProvider {...detailsForm}>
        <RegisterFormDataStep
          isLocked={isRedirectingToVerification}
          onSubmit={submitAccountDetails}
        />
      </FormProvider>
    );
  };

  const currentRegisterStep = renderCurrentRegisterStep();

  return (
    <div className={contentClassName}>
      {shouldShowPageHero ? (
        <header className="grid justify-items-center gap-2 text-center">
          <h1 className="font-brand text-4xl font-semibold leading-tight text-brand sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="max-w-md text-sm leading-6 text-copy-muted sm:text-base">
            {pageDescription}
          </p>
        </header>
      ) : null}

      {currentRegisterStep ? (
        <Card
          className={cn(
            isVerifyMode || confirmedEmail
              ? registerFormCardClassName
              : registerFormDataCardClassName,
            isVerifyMode &&
              !confirmedEmail &&
              "sm:[--card-spacing:--spacing(6)]",
          )}
        >
          {currentRegisterStep}
        </Card>
      ) : null}

      <LoadingOverlay
        description={t("auth.register.overlays.statusDescription")}
        isOpen={shouldShowVerificationStatusOverlay}
        title={t("auth.register.overlays.statusTitle")}
      />
      <LoadingOverlay
        description={t("auth.register.overlays.redirectDescription")}
        isOpen={isRedirectingToVerification}
        title={t("auth.register.overlays.sendCodeTitle")}
      />
      <LoadingOverlay
        description={t("auth.register.overlays.cancelDescription")}
        isOpen={isCancellingRegistration}
        title={t("auth.register.overlays.cancelTitle")}
      />
      <LoadingOverlay
        description={t("auth.register.overlays.redirectDescription")}
        isOpen={detailsForm.formState.isSubmitting}
        title={t("auth.register.overlays.sendCodeTitle")}
      />
    </div>
  );
};

export type { RegisterFormProperties };
