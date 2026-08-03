"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { AppButton } from "@/components/common/app-button"
import { FormField } from "@/components/common/form-field"
import { PhoneNumberInput } from "@/components/common/phone-number-input"
import { Input } from "@/components/ui/input"
import {
  accountRegistrationSchema,
  type AccountRegistrationValues,
} from "@/features/account/schemas/account-registration-schema"
import { BirthDatePicker } from "@/features/booking/components/birth-date-picker"
import { normalizeNameInput, normalizePhoneInput } from "@/features/booking/utils/customer-details-formatters"

type AccountRegistrationPrefill = Partial<
  Pick<AccountRegistrationValues, "email" | "firstName" | "lastName" | "phone">
>

type AccountRegistrationFormProps = {
  defaultValues?: AccountRegistrationPrefill
}

const AccountRegistrationForm = ({ defaultValues }: AccountRegistrationFormProps) => {
  const [isPrepared, setIsPrepared] = useState(false)
  const form = useForm<AccountRegistrationValues>({
    defaultValues: {
      birthDate: "",
      confirmPassword: "",
      email: defaultValues?.email ?? "",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      password: "",
      phone: defaultValues?.phone ?? "",
    },
    mode: "onChange",
    resolver: zodResolver(accountRegistrationSchema),
  })

  const prepareAccount = () => {
    setIsPrepared(true)
  }

  if (isPrepared) {
    return (
      <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="grid gap-1">
          <p className="font-medium">Konto jest gotowe do utworzenia</p>
          <p className="leading-6 text-muted-foreground">
            Po podłączeniu rejestracji wyślemy link aktywacyjny i zapiszemy konto klientki.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(prepareAccount)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="Imię" reserveMessageSpace required>
              <Input
                autoComplete="given-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizeNameInput(event.target.value))}
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
            <FormField error={fieldState.error?.message} label="Nazwisko" reserveMessageSpace required>
              <Input
                autoComplete="family-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizeNameInput(event.target.value))}
                ref={field.ref}
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
            <FormField error={fieldState.error?.message} label="Telefon" reserveMessageSpace required>
              <PhoneNumberInput
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={9}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizePhoneInput(event.target.value))}
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="E-mail" reserveMessageSpace required>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Controller
          control={form.control}
          name="birthDate"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="Data urodzenia" reserveMessageSpace required>
              <BirthDatePicker
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="Hasło" reserveMessageSpace required>
              <Input
                autoComplete="new-password"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
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
            <FormField error={fieldState.error?.message} label="Powtórz hasło" reserveMessageSpace required>
              <Input
                autoComplete="new-password"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                ref={field.ref}
                type="password"
                value={field.value}
              />
            </FormField>
          )}
        />
      </div>

      <div className="flex justify-end">
        <AppButton disabled={!form.formState.isValid} type="submit">
          Utwórz konto
        </AppButton>
      </div>
    </form>
  )
}

export { AccountRegistrationForm }
export type { AccountRegistrationFormProps, AccountRegistrationPrefill }
