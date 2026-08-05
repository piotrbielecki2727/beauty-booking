import Link from "next/link"

import { AppButton } from "@/components/common/app-button"
import { SectionCard } from "@/components/common/section-card"

const BusinessSettingsLoading = () => <main className="min-h-screen bg-background" />

const BusinessSettingsLoginRequired = () => (
  <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
    <SectionCard title="Zaloguj się, aby przejść do zarządzania salonem">
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Ta sekcja jest dostępna po zalogowaniu.
        </p>
        <AppButton nativeButton={false} render={<Link href="/login" />}>
          Zaloguj się
        </AppButton>
      </div>
    </SectionCard>
  </main>
)

const BusinessSettingsNoAccess = () => (
  <SectionCard
    description="Konfiguracja salonu jest dostępna dla właściciela oraz administratora."
    title="Brak dostępu do zarządzania salonem"
  >
    <p className="text-sm leading-6 text-muted-foreground">
      Możesz korzystać z panelu klientki, swoich danych i rezerwacji. Zmiany w
      grafiku, usługach i rezerwacjach online wymagają roli Owner albo Admin.
    </p>
  </SectionCard>
)

export {
  BusinessSettingsLoading,
  BusinessSettingsLoginRequired,
  BusinessSettingsNoAccess,
}
