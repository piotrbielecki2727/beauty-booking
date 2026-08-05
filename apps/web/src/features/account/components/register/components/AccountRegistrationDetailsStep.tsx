"use client";

import { ArrowRight } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { AppButton } from "@/components/common/app-button";
import { FormField } from "@/components/common/form-field";
import { PhoneNumberInput } from "@/components/common/phone-number-input";
import { Input } from "@/components/ui/input";
import type { AccountRegistrationValues } from "@/features/account/components/register/schemas/accountRegistrationSchema";
import { BirthDatePicker } from "@/features/booking/components/BirthDatePicker";
import {
  normalizeNameInput,
  normalizePhoneInput,
} from "@/features/booking/utils/customerDetailsFormatters";

type AccountRegistrationDetailsStepProps = {
  form: UseFormReturn<AccountRegistrationValues>;
  onSubmit: (values: AccountRegistrationValues) => Promise<void> | void;
};

const AccountRegistrationDetailsStep = ({
  form,
  onSubmit,
}: AccountRegistrationDetailsStepProps) => (
  <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormField
              error={fieldState.error?.message}
              label="Imię"
              reserveMessageSpace
              required
            >
              <Input
                autoComplete="given-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(normalizeNameInput(event.target.value))
                }
                placeholder="Anna"
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <FormField
              error={fieldState.error?.message}
              label="Nazwisko"
              reserveMessageSpace
              required
            >
              <Input
                autoComplete="family-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(normalizeNameInput(event.target.value))
                }
                placeholder="Kowalska"
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormField
            description="Na ten adres wyślemy kod potwierdzający."
            error={fieldState.error?.message}
            label="E-mail"
            reserveMessageSpace
            required
          >
            <Input
              autoComplete="email"
              inputMode="email"
              maxLength={254}
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
              autoComplete="new-password"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Minimum 8 znaków"
              ref={field.ref}
              type="password"
              value={field.value}
            />
          </FormField>
        )}
      />

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <FormField
            error={fieldState.error?.message}
            label="Powtórz hasło"
            reserveMessageSpace
            required
          >
            <Input
              autoComplete="new-password"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Powtórz hasło"
              ref={field.ref}
              type="password"
              value={field.value}
            />
          </FormField>
        )}
      />
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <FormField
            error={fieldState.error?.message}
            label="Telefon (opcjonalnie)"
            reserveMessageSpace
          >
            <PhoneNumberInput
              autoComplete="tel-national"
              inputMode="numeric"
              maxLength={9}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange(normalizePhoneInput(event.target.value))
              }
              ref={field.ref}
              value={field.value}
            />
          </FormField>
        )}
      />

      <Controller
        control={form.control}
        name="birthDate"
        render={({ field, fieldState }) => (
          <FormField
            error={fieldState.error?.message}
            label="Data urodzenia (opcjonalnie)"
            reserveMessageSpace
          >
            <BirthDatePicker
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          </FormField>
        )}
      />
    </div>

    <div className="grid gap-3">
      <AppButton
        disabled={!form.formState.isValid}
        fullWidth
        isLoading={form.formState.isSubmitting}
        type="submit"
      >
        Zarejestruj się
        <ArrowRight aria-hidden="true" />
      </AppButton>
      <div className="rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-xs leading-5 text-muted-foreground">
        Telefon ułatwia szybki kontakt w sprawie wizyty, a data urodzenia pomoże
        w przyszłości dopasować rabaty i oferty specjalne.
      </div>
    </div>
  </form>
);

export { AccountRegistrationDetailsStep };
