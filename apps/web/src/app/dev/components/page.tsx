import { CalendarDays, Clock, Scissors, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

import { AppButton } from "@/components/common/app-button"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { FormField } from "@/components/common/form-field"
import { LoadingState } from "@/components/common/loading-state"
import { SectionCard } from "@/components/common/section-card"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThemePaletteSwitcher } from "@/features/theme/components/theme-palette-switcher"
import { ServicePickerDemo } from "./service-picker-demo"

const DevComponentsPage = () => {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <PageContainer className="grid gap-8 py-8 sm:py-10">
        <header className="grid gap-3">
          <Badge variant="secondary" className="w-fit">
            Design system
          </Badge>
          <div className="grid gap-2">
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              Komponenty Beauty Booking
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Fundament kolorów, typografii i stanów interfejsu dla publicznej rezerwacji oraz panelu managera.
            </p>
          </div>
        </header>

        <SectionCard title="Paleta kolorów" description="Motywy oparte o tokeny semantyczne aplikacji.">
          <ThemePaletteSwitcher />
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Typografia" description="Inter dla UI, Playfair Display dla nagłówków.">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <h2 className="font-heading text-3xl font-semibold leading-tight">
                  Wybierz usługę i termin wizyty
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  Tekst interfejsu pozostaje prosty, czytelny i wygodny do skanowania na ekranie telefonu.
                </p>
              </div>
              <div className="grid gap-2 text-sm leading-6">
                <p className="font-medium">UI label: najbliższe wolne terminy</p>
                <p className="text-muted-foreground">
                  Małe etykiety, opisy i komunikaty pomocnicze korzystają z tego samego rytmu i kontrastu.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AppButton" description="Wrapper nad Button z shadcn/ui.">
            <div className="grid gap-3 sm:grid-cols-2">
              <AppButton>
                <Sparkles />
                Primary
              </AppButton>
              <AppButton variant="secondary">
                <CalendarDays />
                Secondary
              </AppButton>
              <AppButton variant="outline">Outline</AppButton>
              <AppButton variant="ghost">Ghost</AppButton>
              <AppButton isLoading loadingText="Zapisywanie" />
              <AppButton disabled>Disabled</AppButton>
              <AppButton fullWidth className="sm:col-span-2">
                Full width
              </AppButton>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            action={<AppButton size="sm">Zapisz</AppButton>}
            title="FormField"
            description="Label, opis, required i komunikat błędu."
          >
            <div className="grid gap-5">
              <FormField description="Widoczna nazwa w publicznym formularzu." label="Nazwa usługi" required>
                <Input placeholder="Manicure hybrydowy" />
              </FormField>
              <FormField error="Podaj krótszy opis usługi." label="Opis usługi">
                <Textarea placeholder="Krótki opis dla klientki" />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="SectionCard" description="Subtelna karta do sekcji panelu i ustawień.">
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-4">
                <div>
                  <p className="font-medium">Kalendarz</p>
                  <p className="text-sm text-muted-foreground">Dzisiaj, 6 wizyt</p>
                </div>
                <Clock className="text-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Karta trzyma nagłówek, opis, akcję i treść bez zakładania konkretnego widoku.
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <EmptyState
            action={<AppButton variant="outline">Dodaj usługę</AppButton>}
            description="Ten stan pasuje do pustych wizyt, usług, klientek lub kalendarza."
            icon={<Scissors aria-hidden="true" />}
            title="Brak usług"
          />
          <ErrorState
            description="Nie udało się pobrać najnowszych danych. Spróbuj ponownie za chwilę."
            retryAction={<AppButton variant="outline">Ponów</AppButton>}
            title="Coś poszło nie tak"
          />
          <SectionCard title="LoadingState">
            <div className="grid gap-6">
              <LoadingState message="Ładowanie terminów" />
              <LoadingState message="Przygotowywanie widoku" variant="skeleton" />
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="ServicePicker"
          description="Pierwszy komponent publicznego flow rezerwacji, zasilany mockami."
        >
          <ServicePickerDemo />
        </SectionCard>
      </PageContainer>
    </main>
  )
}

export default DevComponentsPage
