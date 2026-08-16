import { CustomerNavbar } from "@/components/layout/customerNavbar";
import { BackgroundSVG } from "@/components/svgs";

import type { ReactNode } from "react";

export const CustomerAppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      <BackgroundSVG />
      <CustomerNavbar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};
