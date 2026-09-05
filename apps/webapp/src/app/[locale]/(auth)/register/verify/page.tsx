import {
  RegisterForm,
  RegisterPageShell,
} from "@/features/account/components/register";
import { getSafeAuthRedirect } from "@/features/account/lib";

export default async function RegisterVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <RegisterPageShell>
      <RegisterForm mode="verify" redirectTo={getSafeAuthRedirect(next)} />
    </RegisterPageShell>
  );
}
