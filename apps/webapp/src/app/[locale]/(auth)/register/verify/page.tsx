import {
  RegisterForm,
  RegisterPageShell,
} from "@/features/account/components/register";

export default function RegisterVerifyPage() {
  return (
    <RegisterPageShell>
      <RegisterForm mode="verify" />
    </RegisterPageShell>
  );
}
