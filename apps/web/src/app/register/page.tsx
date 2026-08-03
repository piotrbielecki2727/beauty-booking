import type { Metadata } from "next"

import { SectionCard } from "@/components/common/section-card"
import { PageContainer } from "@/components/layout/page-container"
import { AccountRegistrationForm } from "@/features/account/components/account-registration-form"
import type { AccountRegistrationPrefill } from "@/features/account/components/account-registration-form"

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const metadata: Metadata = {
  title: "Załóż konto | Beauty Booking",
  description: "Utwórz konto klientki i zarządzaj swoimi wizytami.",
}

const getSearchParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const params = await searchParams
  const isBookingPrefill = getSearchParam(params.source) === "booking"
  const defaultValues: AccountRegistrationPrefill = {
    email: getSearchParam(params.email),
    firstName: getSearchParam(params.firstName),
    lastName: getSearchParam(params.lastName),
    phone: getSearchParam(params.phone),
  }

  return (
    <main className="min-h-screen bg-background">
      <PageContainer className="mx-auto grid max-w-3xl gap-8 py-8 sm:py-10">
        <header className="grid gap-3">
          <p className="text-sm font-medium text-primary">Konto klientki</p>
          <div className="grid gap-2">
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">Załóż konto</h1>
            <p className="text-base leading-7 text-muted-foreground">
              {isBookingPrefill
                ? "Uzupełniliśmy dane z rezerwacji. Dodaj hasło i datę urodzenia, aby dokończyć tworzenie konta."
                : "Uzupełnij dane, aby szybciej rezerwować kolejne wizyty i korzystać z historii oraz benefitów."}
            </p>
          </div>
        </header>

        <SectionCard title="Dane konta" description="Te informacje posłużą do obsługi wizyt i logowania.">
          <AccountRegistrationForm defaultValues={defaultValues} />
        </SectionCard>
      </PageContainer>
    </main>
  )
}

export default RegisterPage
