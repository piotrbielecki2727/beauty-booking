"use client";

import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useController, useFormContext, useFormState } from "react-hook-form";

import {
  Button,
  Checkbox,
  DatePickerControl,
  InputControl,
  PhoneNumberInputControl,
} from "@/components";
import { useTranslatedFieldError } from "@/components/controlled";
import { legalLinks } from "@/config";
import { Link } from "@/i18n/navigation";

import type { ReactNode } from "react";
import type { AccountRegistrationValues } from "@beauty-booking/shared";

type RegisterFormDataStepProperties = {
  isLocked?: boolean;
  onSubmit: (values: AccountRegistrationValues) => Promise<void> | void;
};

const formatNameValue = (value: string) => {
  return value.replace(/[^\p{L}\p{M}'’ -]/gu, "");
};

const registerFormInputClassName =
  "h-11 rounded-none border-0 border-b border-line-strong bg-transparent px-0 shadow-none ring-0 placeholder:text-copy-subtle hover:border-brand hover:bg-transparent focus-visible:border-brand focus-visible:ring-0 data-popup-open:border-brand aria-invalid:border-line-strong aria-invalid:ring-0";

const registerFormLabelClassName =
  "text-[10px] font-medium uppercase tracking-[0.28em] text-brand";
const registerFormFieldFeedbackMode = "reserved";

const renderRegisterFormLabel = (label: ReactNode) => {
  return <span className={registerFormLabelClassName}>{label}</span>;
};

export const RegisterFormDataStep = ({
  isLocked = false,
  onSubmit,
}: RegisterFormDataStepProperties) => {
  const t = useTranslations();
  const { control, handleSubmit } = useFormContext<AccountRegistrationValues>();
  const { isSubmitting, isValid } = useFormState({
    control,
  });
  const {
    field: consentField,
    fieldState: { error: consentFieldError },
  } = useController({
    control,
    name: "acceptTermsAndPrivacyPolicy",
  });

  const isSubmitDisabled = isSubmitting || isLocked || !isValid;
  const consentError = useTranslatedFieldError(consentFieldError?.message);
  const consentsLabel = t.rich("auth.register.fields.acceptTermsAndPrivacy", {
    privacyPolicyLink: (chunks: ReactNode) => (
      <Link
        href={legalLinks.privacyPolicy}
        onClick={(event) => event.stopPropagation()}
        rel="noreferrer"
        target="_blank"
      >
        {chunks}
      </Link>
    ),
    termsLink: (chunks: ReactNode) => (
      <Link
        href={legalLinks.terms}
        onClick={(event) => event.stopPropagation()}
        rel="noreferrer"
        target="_blank"
      >
        {chunks}
      </Link>
    ),
  });
  const areConsentsAccepted = Boolean(consentField.value);

  const handleConsentsChange = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;

    consentField.onChange(isChecked);
  };

  return (
    <form
      className="grid rounded-[2rem] border border-line-soft bg-surface px-6 py-8 sm:px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <InputControl
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            formatValue={formatNameValue}
            inputClassName={registerFormInputClassName}
            isRequired
            label={renderRegisterFormLabel(t("auth.register.fields.firstName"))}
            maxLength={40}
            name="firstName"
            placeholder={t("auth.register.placeholders.firstName")}
            type="text"
          />

          <InputControl
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            formatValue={formatNameValue}
            inputClassName={registerFormInputClassName}
            isRequired
            label={renderRegisterFormLabel(t("auth.register.fields.lastName"))}
            maxLength={40}
            name="lastName"
            placeholder={t("auth.register.placeholders.lastName")}
            type="text"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <InputControl
            autoComplete="email"
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            inputClassName={registerFormInputClassName}
            inputMode="email"
            isRequired
            label={renderRegisterFormLabel(t("auth.register.fields.email"))}
            maxLength={254}
            name="email"
            placeholder={t("auth.register.placeholders.email")}
            type="email"
          />

          <PhoneNumberInputControl
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            inputClassName={registerFormInputClassName}
            label={renderRegisterFormLabel(t("auth.register.fields.phone"))}
            name="phone"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <InputControl
            autoComplete="new-password"
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            inputClassName={registerFormInputClassName}
            isRequired
            label={renderRegisterFormLabel(t("auth.register.fields.password"))}
            name="password"
            placeholder={t("auth.register.placeholders.password")}
            type="password"
          />

          <InputControl
            autoComplete="new-password"
            containerClassName="gap-2"
            feedbackMode={registerFormFieldFeedbackMode}
            inputClassName={registerFormInputClassName}
            isRequired
            label={renderRegisterFormLabel(
              t("auth.register.fields.confirmPassword"),
            )}
            name="confirmPassword"
            placeholder={t("auth.register.placeholders.confirmPassword")}
            type="password"
          />
        </div>

        <DatePickerControl
          className={registerFormInputClassName}
          containerClassName="gap-2"
          feedbackMode={registerFormFieldFeedbackMode}
          label={renderRegisterFormLabel(t("auth.register.fields.birthDate"))}
          name="birthDate"
        />
      </div>

      <div className="text-copy-subtle mb-2">
        <Checkbox
          checked={areConsentsAccepted}
          className="border-line-strong bg-transparent data-checked:border-brand data-checked:bg-brand"
          error={consentError}
          feedbackMode={registerFormFieldFeedbackMode}
          isRequired
          label={consentsLabel}
          labelClassName="text-xs leading-5 text-copy-subtle [&_a]:text-brand"
          name={consentField.name}
          onBlur={() => {
            consentField.onBlur();
          }}
          onCheckedChange={handleConsentsChange}
        />
      </div>

      <Button
        className="h-12 rounded-full bg-brand text-xs uppercase tracking-[0.3em] text-copy-inverse hover:bg-brand-hover"
        isDisabled={isSubmitDisabled}
        isFullWidth
        isLoading={isSubmitting || isLocked}
        type="submit"
      >
        {t("auth.register.actions.submit")}
        <ArrowRightIcon aria-hidden="true" />
      </Button>
    </form>
  );
};

export type { RegisterFormDataStepProperties };
