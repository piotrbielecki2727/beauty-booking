import type { ReactNode } from "react";

import { ManagementAppShell } from "@/components/layout/ManagementAppShell";

export default function ManagementLayout({ children }: { children: ReactNode }) {
  return <ManagementAppShell>{children}</ManagementAppShell>;
}
