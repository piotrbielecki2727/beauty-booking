"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";

import { Button, Checkbox, InputControl } from "@/components";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { AccountLoginValues } from "@beauty-booking/shared";

type LoginFormFieldsProperties = {
  error?: string;
  onSubmit: (values: AccountLoginValues) => Promise<void> | void;
};

const loginFormInputClassName =
  "h-11 rounded-none border-0 border-b border-line-strong bg-transparent px-0 shadow-none [--input-autofill-background:var(--surface)] placeholder:text-copy-subtle hover:border-brand hover:bg-transparent focus-visible:border-brand focus-visible:ring-0 aria-invalid:border-line-strong aria-invalid:ring-0";
const loginFormLabelClassName =
  "text-[10px] font-medium uppercase tracking-[0.28em] text-brand";
const loginFormFieldFeedbackMode = "reserved";

export const LoginFormFields = ({
  error,
  onSubmit,
}: LoginFormFieldsProperties) => {
  const t = useTranslations();
  const [isRemembered, setIsRemembered] = useState(false);
  const { control, handleSubmit } = useFormContext<AccountLoginValues>();
  const { isSubmitting, isValid } = useFormState({ control });
  const isSubmitDisabled = isSubmitting || Boolean(error) || !isValid;

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <InputControl
          autoComplete="email"
          containerClassName="gap-2"
          feedbackMode={loginFormFieldFeedbackMode}
          inputMode="email"
          inputClassName={loginFormInputClassName}
          isDisabled={isSubmitting}
          isRequired
          label={
            <span className={loginFormLabelClassName}>
              {t("auth.login.fields.email")}
            </span>
          }
          maxLength={254}
          name="email"
          placeholder={t("auth.login.placeholders.email")}
          type="email"
        />

        <InputControl
          autoComplete="current-password"
          containerClassName="gap-2"
          feedbackMode={loginFormFieldFeedbackMode}
          inputClassName={loginFormInputClassName}
          isDisabled={isSubmitting}
          isRequired
          label={
            <span className={loginFormLabelClassName}>
              {t("auth.login.fields.password")}
            </span>
          }
          name="password"
          placeholder={t("auth.login.placeholders.password")}
          type="password"
        />
      </div>

      <div className="flex items-center justify-between gap-4 text-xs">
        <Checkbox
          checked={isRemembered}
          className="border-line-strong bg-transparent data-checked:border-brand data-checked:bg-brand"
          containerClassName="gap-0"
          isDisabled={isSubmitting}
          label={t("auth.login.actions.rememberMe")}
          labelClassName="text-xs text-copy-subtle"
          onCheckedChange={(checked) => setIsRemembered(checked === true)}
        />

        <Link
          aria-disabled={isSubmitting}
          className={cn(
            "shrink-0 font-medium text-brand hover:underline",
            isSubmitting && "pointer-events-none opacity-60",
          )}
          href="/forgot-password"
        >
          {t("auth.login.actions.forgotPassword")}
        </Link>
      </div>

      {error ? (
        <p className="rounded-md border border-danger-border bg-danger-surface px-3 py-2 text-sm text-danger-text">
          {error}
        </p>
      ) : null}

      <Button
        className="h-12 rounded-full bg-brand text-xs uppercase tracking-[0.3em] text-copy-inverse hover:bg-brand-hover"
        isDisabled={isSubmitDisabled}
        isFullWidth
        isLoading={isSubmitting}
        type="submit"
      >
        {t("auth.login.actions.submit")}
        {!isSubmitting ? <ArrowRightIcon aria-hidden="true" /> : null}
      </Button>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-copy-muted">
        <span className="h-px flex-1 bg-line" />
        {t("auth.login.texts.separator")}
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        className="h-11 rounded-full border-line-strong bg-transparent text-brand hover:border-brand hover:bg-transparent"
        isDisabled={isSubmitting}
        isFullWidth
        type="button"
        variant="outline"
      >
        <span className="font-semibold">G</span>
        {t("auth.login.actions.google")}
      </Button>
    </form>
  );
};

export type { LoginFormFieldsProperties };
