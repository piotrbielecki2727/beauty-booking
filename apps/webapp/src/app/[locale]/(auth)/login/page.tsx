import { LoginForm } from "@/features/account/components";
import { RegisterPageShell } from "@/features/account/components/register";
import { getSafeAuthRedirect } from "@/features/account/lib";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <RegisterPageShell>
      <LoginForm redirectTo={getSafeAuthRedirect(next)} />
    </RegisterPageShell>
  );
}
