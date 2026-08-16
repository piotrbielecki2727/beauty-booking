import { AuthAppShell } from "@/components/layout/AuthAppShell";

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthAppShell>{children}</AuthAppShell>;
}
