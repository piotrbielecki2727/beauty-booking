"use client"

import { CalendarDays, Mail, Phone, UserRound } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { AppButton } from "@/components/common/app-button"
import { SectionCard } from "@/components/common/section-card"
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell"
import { useAccountSession } from "@/features/account/hooks/useAccountSession"
import { useClientHydrated } from "@/hooks/use-client-hydrated"

const CustomerProfilePage = () => {
  const isHydrated = useClientHydrated()

  if (!isHydrated) {
    return <ProfileLoading />
  }

  return <CustomerProfileContent />
}

const CustomerProfileContent = () => {
  const accountSession = useAccountSession()

  if (!accountSession) {
    return <ProfileLoginRequired />
  }

  return (
    <CustomerAppShell
      accountSession={accountSession}
      description="Dane zapisane przy Twoim koncie."
      title="Dane konta"
    >
      <SectionCard title="Informacje użytkownika">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            icon={<UserRound aria-hidden="true" />}
            label="Imię"
            value={accountSession.firstName || "Nie podano"}
          />
          <ProfileField
            icon={<UserRound aria-hidden="true" />}
            label="Nazwisko"
            value={accountSession.lastName || "Nie podano"}
          />
          <ProfileField icon={<Mail aria-hidden="true" />} label="E-mail" value={accountSession.email} />
          <ProfileField
            icon={<Phone aria-hidden="true" />}
            label="Telefon"
            value={accountSession.phone ? `+48 ${accountSession.phone}` : "Nie podano"}
          />
          <ProfileField
            icon={<CalendarDays aria-hidden="true" />}
            label="Data urodzenia"
            value={accountSession.birthDate || "Nie podano"}
          />
        </div>
      </SectionCard>
    </CustomerAppShell>
  )
}

const ProfileLoading = () => <main className="min-h-screen bg-background" />

type ProfileFieldProps = {
  icon: ReactNode
  label: string
  value: string
}

const ProfileField = ({ icon, label, value }: ProfileFieldProps) => (
  <div className="flex gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-sm">
    <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
    <div className="grid min-w-0 gap-1">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="min-w-0 [overflow-wrap:anywhere] font-medium">{value}</p>
    </div>
  </div>
)

const ProfileLoginRequired = () => (
  <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
    <SectionCard title="Zaloguj się, aby zobaczyć dane konta">
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Dane konta są dostępne po zalogowaniu.
        </p>
        <AppButton nativeButton={false} render={<Link href="/login" />}>
          Zaloguj się
        </AppButton>
      </div>
    </SectionCard>
  </main>
)

export { CustomerProfilePage }
