"use client"

import { SectionCard } from "@/components/common/section-card"
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell"
import { useAccountSession } from "@/features/account/hooks/useAccountSession"
import { useClientHydrated } from "@/hooks/use-client-hydrated"

const AccountStatsPage = () => {
  const accountSession = useAccountSession()
  const isHydrated = useClientHydrated()

  if (!isHydrated) {
    return <main className="min-h-screen bg-background" />
  }

  if (!accountSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
        <SectionCard title="Zaloguj się">
          <p className="text-sm leading-6 text-muted-foreground">
            Ta sekcja jest dostępna po zalogowaniu.
          </p>
        </SectionCard>
      </main>
    )
  }

  return (
    <CustomerAppShell
      accountSession={accountSession}
      description="Ta sekcja zostanie uzupełniona w kolejnych etapach."
      title="Statystyki i finanse"
    >
      <SectionCard title="W przygotowaniu">
        <p className="text-sm leading-6 text-muted-foreground">
          Tutaj pojawią się statystyki, raporty finansowe i szersza analiza wyników salonu.
        </p>
      </SectionCard>
    </CustomerAppShell>
  )
}

export default AccountStatsPage
