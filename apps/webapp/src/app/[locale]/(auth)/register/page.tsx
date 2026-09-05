import {
  RegisterForm,
  RegisterPageShell,
} from "@/features/account/components/register";
import { getSafeAuthRedirect } from "@/features/account/lib";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <RegisterPageShell>
      <RegisterForm redirectTo={getSafeAuthRedirect(next)} />
    </RegisterPageShell>
  );
}
