import type { Metadata } from "next";
import Link from "next/link";

import { AppButton } from "@/components/common/app-button";
import { SectionCard } from "@/components/common/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { AccountRegistrationForm } from "@/features/account/components/register";
import type { AccountRegistrationPrefill } from "@/features/account/components/register";
import { buildAccountRegistrationPrefill } from "@/features/account/components/register/utils/accountRegistrationUtils";

type RegisterFormPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  description:
    "Uzupełnij dane konta i potwierdź e-mail kodem, aby założyć konto klientki.",
  title: "Rejestracja | Beauty Booking",
};

const RegisterFormPage = async ({ searchParams }: RegisterFormPageProps) => {
  const params = await searchParams;
  const defaultValues: AccountRegistrationPrefill =
    buildAccountRegistrationPrefill(params);

  return (
    <main className="min-h-screen bg-background">
      <PageContainer className="grid min-h-screen place-items-center py-8 sm:py-10">
        <div className="grid w-full max-w-md gap-6">
          <header className="grid gap-3">
            <p className="text-sm font-medium text-primary">Konto klientki</p>
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              Załóż konto
            </h1>
          </header>

          <SectionCard>
            <AccountRegistrationForm defaultValues={defaultValues} />
          </SectionCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <AppButton
              nativeButton={false}
              render={<Link href="/login" />}
              variant="outline"
            >
              Mam już konto
            </AppButton>
            <AppButton
              nativeButton={false}
              render={<Link href="/" />}
              variant="secondary"
            >
              Wróć na stronę główną
            </AppButton>
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default RegisterFormPage;
