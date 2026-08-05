import Link from "next/link";
import {
  CalendarClock,
  Gift,
  History,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { SectionCard } from "@/components/common/section-card";

type LandingBenefitProps = {
  icon: React.ReactNode;
  label: string;
};

type AccountBenefitProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

const LandingBenefit = ({ icon, label }: LandingBenefitProps) => (
  <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm font-medium shadow-sm">
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary [&_svg]:size-4">
      {icon}
    </span>
    <span>{label}</span>
  </div>
);

const AccountBenefit = ({ icon, title, value }: AccountBenefitProps) => (
  <div className="flex gap-3 rounded-lg border border-border/70 bg-background/60 px-4 py-3 text-sm">
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary [&_svg]:size-4">
      {icon}
    </span>
    <div className="grid gap-1">
      <p className="font-medium">{title}</p>
      <p className="leading-6 text-muted-foreground">{value}</p>
    </div>
  </div>
);

const AccountLanding = () => (
  <main className="min-h-screen bg-background">
    <div className="mx-auto grid min-h-screen w-full max-w-5xl place-items-center px-4 py-8 sm:px-6">
      <section className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <p className="text-sm font-medium text-primary">Beauty Booking</p>
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              Załóż konto i rezerwuj wygodniej
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Jedno konto wystarczy, żeby szybciej wracać do kolejnych wizyt,
              korzystać z zapisanych danych i mieć rezerwacje pod ręką.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <LandingBenefit
              icon={<History aria-hidden="true" />}
              label="Historia wizyt"
            />
            <LandingBenefit
              icon={<CalendarClock aria-hidden="true" />}
              label="Szybsze umawianie"
            />
            <LandingBenefit
              icon={<Gift aria-hidden="true" />}
              label="Rabaty i benefity"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AppButton
              nativeButton={false}
              render={<Link href="/register/form" />}
            >
              Załóż konto
            </AppButton>
            <AppButton
              nativeButton={false}
              render={<Link href="/login" />}
              variant="outline"
            >
              Mam już konto
            </AppButton>
          </div>
        </div>

        <SectionCard title="Co daje konto?">
          <div className="grid gap-3">
            <AccountBenefit
              icon={<Sparkles aria-hidden="true" />}
              title="Mniej wpisywania przy kolejnych rezerwacjach"
              value="Dane kontaktowe pozostają przy koncie, więc następna rezerwacja wymaga mniej kroków."
            />
            <AccountBenefit
              icon={<ShieldCheck aria-hidden="true" />}
              title="Lepsza kontrola nad wizytami"
              value="Łatwiej sprawdzisz najbliższy termin, szczegóły usługi i historię wizyt."
            />
            <AccountBenefit
              icon={<Gift aria-hidden="true" />}
              title="Miejsce na przyszłe benefity"
              value="Konto przygotuje nas pod program lojalnościowy, rabaty i indywidualne oferty."
            />
          </div>
        </SectionCard>
      </section>
    </div>
  </main>
);

export { AccountLanding };
