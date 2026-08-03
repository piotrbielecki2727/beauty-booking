"use client"

import { Gift, History, Sparkles } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { AppButton } from "@/components/common/app-button"
import type { AccountInviteVariant, StoredBookingReservation } from "@/features/booking/types/reservation"

type AccountInviteCardProps = {
  reservation: StoredBookingReservation
  variant: AccountInviteVariant
}

const AccountInviteCard = ({ reservation, variant }: AccountInviteCardProps) => {
  const hasEmail = variant === "with-email"
  const registrationHref = {
    pathname: "/register",
    query: {
      email: reservation.customerDetails.email,
      firstName: reservation.customerDetails.firstName,
      lastName: reservation.customerDetails.lastName,
      phone: reservation.customerDetails.phone,
      reservationId: reservation.id,
      source: "booking",
    },
  }

  return (
    <div className="grid gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm">
      <div className="grid gap-2">
        <h3 className="font-heading text-xl font-medium">
          {hasEmail ? "Jesteś o krok od wygodniejszej obsługi wizyt" : "Polecamy założenie konta"}
        </h3>
        <p className="leading-6 text-muted-foreground">
          {hasEmail
            ? "Wprowadzony e-mail pozwala szybko dokończyć rejestrację. Uzupełnij tylko hasło i datę urodzenia, aby wygodnie zarządzać kolejnymi wizytami."
            : "Założenie konta zajmuje chwilę, a przy kolejnych rezerwacjach dane kontaktowe uzupełnią się automatycznie."}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Benefit icon={<History aria-hidden="true" />} label="Historia wizyt" />
        <Benefit icon={<Gift aria-hidden="true" />} label="Program lojalnościowy" />
        <Benefit icon={<Sparkles aria-hidden="true" />} label="Indywidualne rabaty" />
      </div>

      <div className="flex">
        <AppButton nativeButton={false} render={<Link href={registrationHref} />}>
          Załóż konto
        </AppButton>
      </div>
    </div>
  )
}

type BenefitProps = {
  icon: ReactNode
  label: string
}

const Benefit = ({ icon, label }: BenefitProps) => (
  <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-muted-foreground">
    <span className="text-primary">{icon}</span>
    <span>{label}</span>
  </div>
)

export { AccountInviteCard }
export type { AccountInviteCardProps }
