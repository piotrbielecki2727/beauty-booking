import type { Metadata } from "next"
import Link from "next/link"

import { SectionCard } from "@/components/common/section-card"
import { PageContainer } from "@/components/layout/page-container"
import { ManagerLoginForm } from "@/features/auth/components/ManagerLoginForm"

export const metadata: Metadata = {
  title: "Logowanie managera | Beauty Booking",
  description: "Zaloguj się do panelu zarządzania rezerwacjami.",
}

const ManagerLoginPage = () => (
  <main className="min-h-screen bg-background">
    <PageContainer className="grid min-h-screen place-items-center py-8 sm:py-10">
      <div className="grid w-full max-w-md gap-6">
        <header className="grid gap-3 text-center">
          <p className="text-sm font-medium text-primary">Panel managera</p>
          <div className="grid gap-2">
            <h1 className="font-heading text-4xl font-semibold leading-tight">Zaloguj się do salonu</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Zarządzaj wizytami, klientkami i dostępnością z jednego miejsca.
            </p>
          </div>
        </header>

        <SectionCard title="Dane logowania" description="Na tym etapie używamy testowego konta managera.">
          <ManagerLoginForm />
        </SectionCard>

        <div className="flex justify-center">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-4xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            href="/booking"
          >
            Przejdź do rezerwacji klientki
          </Link>
        </div>
      </div>
    </PageContainer>
  </main>
)

export default ManagerLoginPage
