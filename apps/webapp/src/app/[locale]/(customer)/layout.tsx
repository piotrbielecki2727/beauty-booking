import { CustomerAppShell } from "@/components/layout/CustomerAppShell";

import type { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <CustomerAppShell>{children}</CustomerAppShell>;
}
