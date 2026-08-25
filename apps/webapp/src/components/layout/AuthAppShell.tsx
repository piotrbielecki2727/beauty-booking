import { CustomerNavbar } from "@/components/layout/customerNavbar";

import type { ReactNode } from "react";

export const AuthAppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <CustomerNavbar />
      {children}
    </div>
  );
};
