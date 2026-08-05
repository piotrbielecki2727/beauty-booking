import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/components/common/app-button";
import { SectionCard } from "@/components/common/section-card";
import { PageContainer } from "@/components/layout/page-container";

const BookingAccessRequired = () => (
  <main className="min-h-screen bg-background">
    <PageContainer className="grid gap-8 py-8 sm:py-10">
      <header className="mx-auto grid w-full max-w-3xl gap-3">
        <p className="text-sm font-medium text-primary">Rezerwacja online</p>
        <div className="grid gap-2">
          <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Umów wizytę w kilku krokach
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Zaloguj się, aby wybrać usługę, termin i potwierdzić wizytę.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <SectionCard title="Zaloguj się, aby zarezerwować wizytę">
          <div className="grid gap-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Rezerwacje są przypisywane do konta. Dzięki temu szybciej umówisz
              kolejną wizytę i sprawdzisz swoje terminy w jednym miejscu.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AppButton nativeButton={false} render={<Link href="/login" />}>
                Zaloguj się
                <ArrowRight aria-hidden="true" />
              </AppButton>
              <AppButton
                nativeButton={false}
                render={<Link href="/register/form" />}
                variant="outline"
              >
                Załóż konto
              </AppButton>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  </main>
);

export { BookingAccessRequired };
