"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import type { BookingConsents } from "@/features/booking/types/consents"
import { cn } from "@/lib/utils"

type BookingConsentsFormProps = {
  canUseEmailNotifications: boolean
  consents: BookingConsents
  onConsentChange: (consents: BookingConsents) => void
}

type ConsentOptionProps = {
  checked: boolean
  children: ReactNode
  disabled?: boolean
  id: string
  onCheckedChange: (checked: boolean) => void
}

const BookingConsentsForm = ({
  canUseEmailNotifications,
  consents,
  onConsentChange,
}: BookingConsentsFormProps) => {
  const updateConsent = (key: keyof BookingConsents, value: boolean) => {
    onConsentChange({
      ...consents,
      [key]: value,
    })
  }

  return (
    <div className="grid gap-3 border-t border-border pt-4">
      <p className="text-sm font-medium">Zgody i powiadomienia</p>
      <ConsentOption
        checked={consents.termsAccepted}
        id="booking-terms-consent"
        onCheckedChange={(checked) => updateConsent("termsAccepted", checked)}
      >
        Akceptuję{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href="/regulamin"
          onClick={(event) => event.stopPropagation()}
          rel="noopener noreferrer"
          target="_blank"
        >
          regulamin rezerwacji
        </Link>
        . <span className="text-destructive">*</span>
      </ConsentOption>
      <ConsentOption
        checked={consents.phoneNotifications}
        id="booking-phone-notifications-consent"
        onCheckedChange={(checked) => updateConsent("phoneNotifications", checked)}
      >
        Chcę otrzymywać powiadomienia dotyczące wizyty na numer telefonu.
      </ConsentOption>
      <ConsentOption
        checked={consents.emailNotifications}
        disabled={!canUseEmailNotifications}
        id="booking-email-notifications-consent"
        onCheckedChange={(checked) => updateConsent("emailNotifications", checked)}
      >
        Chcę otrzymywać powiadomienia dotyczące wizyty na adres e-mail.
      </ConsentOption>
      {!canUseEmailNotifications ? (
        <p className="pl-8 text-xs leading-5 text-muted-foreground">
          Dodaj adres e-mail w danych klientki, aby włączyć powiadomienia e-mail.
        </p>
      ) : null}
    </div>
  )
}

const ConsentOption = ({ checked, children, disabled = false, id, onCheckedChange }: ConsentOptionProps) => (
  <div
    className={cn(
      "flex gap-3 text-sm leading-6 text-muted-foreground",
      disabled && "opacity-60"
    )}
  >
    <Checkbox
      aria-labelledby={`${id}-label`}
      checked={checked}
      disabled={disabled}
      id={id}
      onCheckedChange={onCheckedChange}
    />
    <span className="min-w-0 [overflow-wrap:anywhere]" id={`${id}-label`}>
      {children}
    </span>
  </div>
)

export { BookingConsentsForm }
export type { BookingConsentsFormProps }
