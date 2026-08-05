"use client"

import { ArrowRight, ShieldCheck } from "lucide-react"
import { Controller, type UseFormReturn } from "react-hook-form"

import { AppButton } from "@/components/common/app-button"
import { FormField } from "@/components/common/form-field"
import { Input } from "@/components/ui/input"
import type { AccountVerificationCodeValues } from "@/features/account/components/register/schemas/accountVerificationCodeSchema"

type AccountRegistrationVerificationStepProps = {
  form: UseFormReturn<AccountVerificationCodeValues>
  onBack: () => void
  onSubmit: (values: AccountVerificationCodeValues) => Promise<void> | void
  verificationTarget: string
}

const AccountRegistrationVerificationStep = ({ form, onBack, onSubmit, verificationTarget }: AccountRegistrationVerificationStepProps) => (
  <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
    <div className="grid gap-2">
      <h2 className="font-heading text-xl font-medium">Potwierdź e-mail</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Wysłaliśmy kod na {verificationTarget}. Wpisz go poniżej, aby zakończyć rejestrację.
      </p>
    </div>

    <Controller
      control={form.control}
      name="code"
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} label="Kod e-mail" reserveMessageSpace required>
          <Input
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            name={field.name}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            ref={field.ref}
            value={field.value}
          />
        </FormField>
      )}
    />

    <div className="flex gap-3 rounded-lg border border-border bg-muted/45 p-4 text-sm text-muted-foreground">
      <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
      <p aria-live="polite">Wpisz 6-cyfrowy kod otrzymany w wiadomości e-mail.</p>
    </div>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <AppButton onClick={onBack} type="button" variant="outline">
        Wróć do formularza
      </AppButton>
      <AppButton disabled={!form.formState.isValid} isLoading={form.formState.isSubmitting} type="submit">
        Potwierdź e-mail
        <ArrowRight aria-hidden="true" />
      </AppButton>
    </div>
  </form>
)

export { AccountRegistrationVerificationStep }