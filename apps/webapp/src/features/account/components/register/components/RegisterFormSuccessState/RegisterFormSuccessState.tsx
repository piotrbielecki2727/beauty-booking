"use client";

import { ArrowRightIcon, CheckIcon, HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components";
import { Link } from "@/i18n/navigation";

type RegisterFormSuccessStateProperties = {
  email: string;
};

export const RegisterFormSuccessState = ({
  email,
}: RegisterFormSuccessStateProperties) => {
  const t = useTranslations();

  return (
    <div className="grid justify-items-center gap-8 py-4 text-center sm:px-8 sm:py-8">
      <div className="grid size-20 place-items-center rounded-full bg-brand-wash text-brand">
        <CheckIcon aria-hidden="true" className="size-10" />
      </div>

      <div className="grid justify-items-center gap-5">
        <h1 className="max-w-sm font-brand text-4xl font-semibold leading-tight text-brand sm:text-5xl">
          {t("auth.register.success.title")}
        </h1>

        <div className="flex w-full max-w-xs items-center gap-4 text-brand-divider">
          <span className="h-px flex-1 bg-current" />
          <HeartIcon aria-hidden="true" className="size-4" />
          <span className="h-px flex-1 bg-current" />
        </div>

        <p className="max-w-xs text-sm leading-6 text-copy-muted">
          {t("auth.register.success.description", { email })}
        </p>
      </div>

      <div className="grid w-full gap-5">
        <Button
          className="relative h-12 rounded-md bg-brand px-10 text-copy-inverse hover:bg-brand-hover"
          isFullWidth
          render={<Link href="/login" />}
        >
          <span>{t("auth.register.actions.goToLogin")}</span>
          <ArrowRightIcon
            aria-hidden="true"
            className="absolute right-5 top-1/2 size-4 -translate-y-1/2"
          />
        </Button>

        <Button
          className="h-auto justify-self-center px-2 py-1 text-xs text-copy-muted underline underline-offset-4 hover:bg-transparent hover:text-brand"
          render={<Link href="/" />}
          variant="ghost"
        >
          {t("auth.register.actions.backHome")}
        </Button>
      </div>
    </div>
  );
};

export type { RegisterFormSuccessStateProperties };
