"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import { LockKeyholeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LoadingOverlay } from "@/components";
import { legalLinks } from "@/config";
import { Link } from "@/i18n/navigation";

import { LoginFormFields } from "../LoginFormFields";
import { useLoginFlow, useLoginForm } from "./hooks";

import type { ReactNode } from "react";
import type { AccountLoginValues } from "@beauty-booking/shared";

type LoginFormProperties = {
  redirectTo?: string;
};

export const LoginForm = ({ redirectTo }: LoginFormProperties) => {
  const t = useTranslations();
  const form = useLoginForm();
  const { isRedirecting, submitLogin } = useLoginFlow(redirectTo);
  const [loginError, setLoginError] = useState<string>();
  const lastFailedCredentialsRef = useRef<AccountLoginValues | undefined>(
    undefined,
  );

  const email = form.watch("email");
  const password = form.watch("password");

  useEffect(() => {
    const lastFailedCredentials = lastFailedCredentialsRef.current;

    if (
      !loginError ||
      !lastFailedCredentials ||
      (email === lastFailedCredentials.email &&
        password === lastFailedCredentials.password)
    ) {
      return;
    }

    lastFailedCredentialsRef.current = undefined;
    setLoginError(undefined);
  }, [email, loginError, password]);

  const handleSubmit = async (values: AccountLoginValues) => {
    setLoginError(undefined);

    const result = await submitLogin(values);

    if (!result.isSuccess) {
      lastFailedCredentialsRef.current = values;
      setLoginError(result.message);
    }
  };

  return (
    <div className="grid w-full max-w-md gap-6">
      <header className="grid justify-items-center gap-3 text-center">
        <h1 className="font-brand text-5xl font-semibold leading-tight text-brand sm:text-6xl">
          {t("auth.login.hero.title")}
        </h1>
        <p className="max-w-md text-sm leading-6 text-copy-muted sm:text-base">
          {t("auth.login.hero.description")}
        </p>
      </header>

      <section className="rounded-[1.75rem] border border-line-soft bg-surface px-6 py-8 shadow-lg shadow-brand-shadow sm:px-8">
        <FormProvider {...form}>
          <LoginFormFields error={loginError} onSubmit={handleSubmit} />
        </FormProvider>

        <p className="mt-6 text-center text-sm text-copy-muted">
          {t("auth.login.actions.noAccount")}{" "}
          <Link
            className="font-medium text-brand hover:underline"
            href="/register"
          >
            {t("auth.login.actions.register")}
          </Link>
        </p>
      </section>

      <div className="grid justify-items-center gap-3 text-center text-xs leading-5 text-copy-muted">
        <p className="inline-flex items-center gap-1.5">
          <LockKeyholeIcon aria-hidden="true" className="size-3.5" />
          {t("auth.login.texts.security")}
        </p>
        <p>
          {t.rich("auth.login.texts.privacy", {
            privacyPolicyLink: (chunks: ReactNode) => (
              <Link
                className="font-medium text-brand hover:underline"
                href={legalLinks.privacyPolicy}
                rel="noreferrer"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <LoadingOverlay isOpen={isRedirecting} variant="bare" />
    </div>
  );
};
