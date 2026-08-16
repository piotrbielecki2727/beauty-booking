"use client";

import {
  ArrowRightIcon,
  MailIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { Button, InputControl } from "@/components";

import type { AccountVerificationCodeValues } from "@beauty-booking/shared";

type RegisterFormVerificationStepProperties = {
  codeExpiresText?: string;
  isCodeExpired: boolean;
  isResendDisabled: boolean;
  isResendingCode: boolean;
  onBack: () => Promise<void> | void;
  onResendCode: () => Promise<void> | void;
  onSubmit: (values: AccountVerificationCodeValues) => Promise<void> | void;
  resendCooldownText?: string;
  resendLimitText?: string;
  verificationTarget: string;
};

const shortenEmailAddress = (email: string) => {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email.length > 32
      ? `${email.slice(0, 14)}...${email.slice(-12)}`
      : email;
  }

  if (localPart.length <= 28) {
    return email;
  }

  return `${localPart.slice(0, 12)}...${localPart.slice(-10)}@${domain}`;
};

export const RegisterFormVerificationStep = ({
  codeExpiresText,
  isCodeExpired,
  isResendDisabled,
  isResendingCode,
  onBack,
  onResendCode,
  onSubmit,
  resendCooldownText,
  resendLimitText,
  verificationTarget,
}: RegisterFormVerificationStepProperties) => {
  const t = useTranslations();
  const { control, handleSubmit } =
    useFormContext<AccountVerificationCodeValues>();
  const code = useWatch({ control, name: "code" });
  const { isSubmitting, isValid } = useFormState({ control });

  const normalizedCode = typeof code === "string" ? code : "";
  const isSubmitDisabled =
    isSubmitting || isCodeExpired || normalizedCode.length !== 6 || !isValid;
  const codeStatusText = isCodeExpired
    ? t("auth.register.feedback.codeExpired")
    : codeExpiresText;
  const visibleVerificationTarget = shortenEmailAddress(verificationTarget);
  const verificationInputClassName =
    "border-brand-border-muted hover:border-brand focus-visible:border-brand focus-visible:ring-brand-border-muted";

  return (
    <form className="grid gap-5 sm:gap-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="grid justify-items-center gap-4 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-brand-wash text-brand sm:size-16">
          <MailIcon aria-hidden="true" className="size-7 sm:size-8" />
        </div>

        <div className="grid gap-3">
          <h1 className="font-brand text-3xl font-semibold leading-tight text-brand sm:text-4xl">
            {t("auth.register.hero.verifyTitle")}
          </h1>
          <p className="max-w-sm text-sm leading-6 text-copy-muted">
            <span className="block">
              {t("auth.register.texts.verificationIntro")}
            </span>
            <strong
              className="block max-w-full font-semibold text-copy"
              title={verificationTarget}
            >
              {visibleVerificationTarget}
            </strong>
            <span className="block">
              {t("auth.register.texts.verificationOutro")}
            </span>
          </p>
        </div>
      </header>

      <div className="grid gap-3">
        <InputControl
          autoComplete="one-time-code"
          feedbackMinLines={1}
          feedbackMode="reserved"
          formatValue={(value) => value.replace(/\D/g, "").slice(0, 6)}
          inputMode="numeric"
          inputClassName={verificationInputClassName}
          isDisabled={isSubmitting}
          isRequired
          label={t("auth.register.fields.verificationCode")}
          maxLength={6}
          name="code"
          placeholder={t("auth.register.placeholders.verificationCode")}
        />

        <div className="flex gap-3 rounded-lg border border-brand-border-muted bg-brand-wash-subtle px-4 py-3 text-sm text-copy-muted">
          <ShieldCheckIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand sm:mt-1"
          />
          <div className="grid gap-1" aria-live="polite">
            {codeStatusText ? <p>{codeStatusText}</p> : null}
            {resendCooldownText ? <p>{resendCooldownText}</p> : null}
            {resendLimitText ? <p>{resendLimitText}</p> : null}
          </div>
        </div>
      </div>

      <div className="grid justify-items-center gap-4">
        <Button
          className="relative h-11 w-full bg-brand px-10 text-copy-inverse hover:bg-brand-hover"
          isDisabled={isSubmitDisabled}
          isLoading={isSubmitting}
          type="submit"
        >
          <span>{t("auth.register.actions.verifyEmail")}</span>
          {!isSubmitting ? (
            <ArrowRightIcon
              aria-hidden="true"
              className="absolute right-4 top-1/2 -translate-y-1/2"
            />
          ) : null}
        </Button>

        <Button
          className="h-9 border border-brand-border-muted bg-brand-wash-subtle px-4 text-brand hover:bg-brand-wash hover:text-brand disabled:border-transparent disabled:bg-transparent disabled:text-copy-muted"
          isDisabled={isSubmitting || isResendDisabled}
          isLoading={isResendingCode}
          onClick={onResendCode}
          type="button"
          variant="ghost"
        >
          {t("auth.register.actions.resendCode")}
          <RefreshCwIcon aria-hidden="true" />
        </Button>

        <Button
          className="h-auto px-2 py-1 text-xs text-copy-muted underline underline-offset-4 hover:bg-transparent hover:text-brand"
          isDisabled={isSubmitting}
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          {t("auth.register.actions.cancelRegistration")}
        </Button>
      </div>
    </form>
  );
};

export type { RegisterFormVerificationStepProperties };
