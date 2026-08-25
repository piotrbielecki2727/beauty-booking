import { LoginForm } from "@/features/account/components";
import { RegisterPageShell } from "@/features/account/components/register";

const getSafeRedirectTo = (value: string | string[] | undefined) => {
  if (typeof value !== "string") {
    return undefined;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  if (value.startsWith("/login") || value.startsWith("/register")) {
    return undefined;
  }

  return value;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <RegisterPageShell>
      <LoginForm redirectTo={getSafeRedirectTo(next)} />
    </RegisterPageShell>
  );
}
