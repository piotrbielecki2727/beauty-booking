import type { Metadata } from "next"

import { SectionCard } from "@/components/common/section-card"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Regulamin rezerwacji | Beauty Booking",
  description: "Zasady składania i obsługi rezerwacji online.",
}

const rules = [
  {
    title: "Zakres usługi",
    content:
      "Rezerwacja online umożliwia wybór usługi, terminu oraz przekazanie danych kontaktowych potrzebnych do obsługi wizyty.",
  },
  {
    title: "Potwierdzenie rezerwacji",
    content:
      "Rezerwacja zostaje przyjęta po poprawnym potwierdzeniu numeru telefonu kodem SMS oraz zapisaniu zgłoszenia w systemie.",
  },
  {
    title: "Zmiana lub odwołanie wizyty",
    content:
      "Klientka może skontaktować się z salonem w celu zmiany lub odwołania wizyty. Salon może określić minimalny czas wymagany do bezpłatnego odwołania terminu.",
  },
  {
    title: "Spóźnienie",
    content:
      "W przypadku spóźnienia salon może skrócić zakres usługi lub zaproponować inny termin, jeżeli realizacja wizyty wpłynęłaby na kolejne rezerwacje.",
  },
  {
    title: "Dane kontaktowe",
    content:
      "Dane podane podczas rezerwacji są wykorzystywane do potwierdzenia wizyty, kontaktu organizacyjnego oraz obsługi powiadomień, jeśli klientka wyrazi odpowiednią zgodę.",
  },
  {
    title: "Powiadomienia",
    content:
      "Zgody na powiadomienia SMS i e-mail są dobrowolne. Ich brak nie uniemożliwia rezerwacji, o ile zaakceptowano regulamin i podano wymagane dane.",
  },
] as const

const TermsPage = () => (
  <main className="min-h-screen bg-background">
    <PageContainer className="mx-auto grid max-w-3xl gap-8 py-8 sm:py-10">
      <header className="grid gap-3">
        <p className="text-sm font-medium text-primary">Dokument</p>
        <div className="grid gap-2">
          <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Regulamin rezerwacji
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Przykładowe zasady obsługi rezerwacji online. Docelowa treść powinna zostać uzupełniona o dane salonu,
            politykę odwołań i wymagane informacje prawne.
          </p>
        </div>
      </header>

      <SectionCard title="Zasady korzystania z rezerwacji">
        <div className="grid gap-5">
          {rules.map((rule, index) => (
            <section className="grid gap-2 border-t border-border pt-5 first:border-t-0 first:pt-0" key={rule.title}>
              <h2 className="font-heading text-xl font-medium">
                {index + 1}. {rule.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">{rule.content}</p>
            </section>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  </main>
)

export default TermsPage
