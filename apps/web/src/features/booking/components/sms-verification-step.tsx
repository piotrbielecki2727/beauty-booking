"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { AppButton } from "@/components/common/app-button"
import { FormField } from "@/components/common/form-field"
import { SectionCard } from "@/components/common/section-card"
import { Input } from "@/components/ui/input"
import {
  verificationCodeSchema,
  type VerificationCodeValues,
} from "@/features/booking/schemas/verification-code-schema"
import { formatPolishPhoneNumber } from "@/features/booking/utils/customer-details-formatters"

type SmsVerificationStepProps = {
  onResendCode: () => Promise<void>
  onVerify: (code: string) => Promise<boolean>
  phone: string
}

const verificationTimeLimit = 90

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = String(seconds % 60).padStart(2, "0")

  return `${minutes}:${remainingSeconds}`
}

const SmsVerificationStep = ({ onResendCode, onVerify, phone }: SmsVerificationStepProps) => {
  const [secondsLeft, setSecondsLeft] = useState(verificationTimeLimit)
  const [isResendingCode, setIsResendingCode] = useState(false)
  const isCodeExpired = secondsLeft === 0
  const form = useForm<VerificationCodeValues>({
    defaultValues: {
      code: "",
    },
    mode: "onChange",
    resolver: zodResolver(verificationCodeSchema),
  })

  useEffect(() => {
    if (secondsLeft === 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((currentValue) => Math.max(currentValue - 1, 0))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [secondsLeft])

  const submitVerificationCode = async (values: VerificationCodeValues) => {
    if (isCodeExpired) {
      form.setError("code", {
        message: "Kod wygasł. Wyślij nowy kod SMS.",
        type: "validate",
      })

      return
    }

    const isVerified = await onVerify(values.code)

    if (!isVerified) {
      form.setError("code", {
        message: "Kod jest nieprawidłowy.",
        type: "validate",
      })
    }
  }

  const resendCode = async () => {
    setIsResendingCode(true)
    await onResendCode()
    form.reset({ code: "" })
    setSecondsLeft(verificationTimeLimit)
    setIsResendingCode(false)
  }

  return (
    <SectionCard
      title="Potwierdź numer telefonu"
      description={`Wysłaliśmy kod SMS na numer ${formatPolishPhoneNumber(phone)}. Wpisz go poniżej, aby zakończyć rezerwację.`}
    >
      <form className="grid gap-5" onSubmit={form.handleSubmit(submitVerificationCode)}>
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <FormField error={fieldState.error?.message} label="Kod SMS" reserveMessageSpace required>
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
          {isCodeExpired ? (
            <p>Czas na wpisanie kodu minął. Wyślij ponownie kod SMS, aby kontynuować rezerwację.</p>
          ) : (
            <p aria-live="polite">
              Kod SMS wygaśnie za
              <span className="ml-1.5 inline-block w-[5ch] font-medium tabular-nums text-foreground">
                {formatCountdown(secondsLeft)}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <AppButton
            disabled={!isCodeExpired}
            isLoading={isResendingCode}
            loadingText="Wysyłamy"
            onClick={resendCode}
            type="button"
            variant="outline"
          >
            <RefreshCw aria-hidden="true" />
            Wyślij ponownie kod
          </AppButton>
          <AppButton
            disabled={!form.formState.isValid || isCodeExpired}
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Potwierdź rezerwację
          </AppButton>
        </div>
      </form>
    </SectionCard>
  )
}

export { SmsVerificationStep }
export type { SmsVerificationStepProps }
