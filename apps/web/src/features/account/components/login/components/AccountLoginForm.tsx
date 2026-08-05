"use client";

import { ArrowRight } from "lucide-react";
import { Controller } from "react-hook-form";

import { AppButton } from "@/components/common/app-button";
import { FormField } from "@/components/common/form-field";
import { SectionCard } from "@/components/common/section-card";
import { Input } from "@/components/ui/input";
import { useAccountLoginForm } from "@/features/account/components/login/hooks/useAccountLoginForm";
import { useAccountLoginFlow } from "@/features/account/components/login/hooks/useAccountLoginFlow";
import type { AccountLoginProps } from "@/features/account/components/login/types/accountLogin";

const AccountLoginForm = ({ defaultEmail = "" }: AccountLoginProps) => {
  const form = useAccountLoginForm({ defaultEmail });
  const { submitLogin } = useAccountLoginFlow();

  const handleSubmit = async (values: Parameters<typeof submitLogin>[0]) => {
    const result = await submitLogin(values);

    if (!result.ok) {
      form.setError("root", {
        message: result.message,
        type: "validate",
      });
    }
  };

  return (
    <SectionCard
      description="Wpisz dane konta, aby przejść do rezerwacji."
      title="Logowanie"
    >
      <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormField
                error={fieldState.error?.message}
                label="E-mail"
                reserveMessageSpace
                required
              >
                <Input
                  autoComplete="email"
                  inputMode="email"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  placeholder="anna@example.com"
                  ref={field.ref}
                  type="email"
                  value={field.value}
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormField
                error={fieldState.error?.message}
                label="Hasło"
                reserveMessageSpace
                required
              >
                <Input
                  autoComplete="current-password"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  placeholder="Wpisz hasło"
                  ref={field.ref}
                  type="password"
                  value={field.value}
                />
              </FormField>
            )}
          />
        </div>

        {form.formState.errors.root?.message ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive">
            {form.formState.errors.root.message}
          </div>
        ) : null}

        <AppButton
          disabled={!form.formState.isValid}
          fullWidth
          isLoading={form.formState.isSubmitting}
          type="submit"
        >
          Zaloguj się
          <ArrowRight aria-hidden="true" />
        </AppButton>
      </form>
    </SectionCard>
  );
};

export { AccountLoginForm };
