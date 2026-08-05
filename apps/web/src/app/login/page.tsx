import type { Metadata } from "next";
import Link from "next/link";

import { AppButton } from "@/components/common/app-button";
import { PageContainer } from "@/components/layout/page-container";
import { AccountLoginForm } from "@/features/account/components/login";
import { getSearchParam } from "@/features/account/components/login/utils/accountLoginUtils";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Logowanie | Beauty Booking",
  description:
    "Zaloguj się do konta klientki, aby zarządzać wizytami i szybciej rezerwować terminy.",
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const defaultEmail = getSearchParam(params.email);

  return (
    <main className="min-h-screen bg-background">
      <PageContainer className="grid min-h-screen place-items-center py-8 sm:py-10">
        <div className="grid w-full max-w-md gap-6">
          <header className="grid gap-3">
            <p className="text-sm font-medium text-primary">Konto klientki</p>
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              Zaloguj się
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Wróć do konta, aby sprawdzić swoje dane i szybciej przejść przez
              rezerwację.
            </p>
          </header>

          <AccountLoginForm defaultEmail={defaultEmail} />

          <div className="grid gap-3 sm:grid-cols-2">
            <AppButton
              nativeButton={false}
              render={<Link href="/register/form" />}
              variant="outline"
            >
              Nie mam konta
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

export default LoginPage;
