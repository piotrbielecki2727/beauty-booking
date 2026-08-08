import { CustomerFooter } from "@/components/layout/customerFooter";
import { CustomerNavbar } from "@/components/layout/customerNavbar";

import type { ReactNode } from "react";

export const CustomerAppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerNavbar />
      <main className="min-w-0 flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
};
