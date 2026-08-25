import { PageContainer } from "@/components/layout/PageContainer";
import { BackgroundSVG } from "@/components/svgs";

import type { ReactNode } from "react";

type RegisterPageShellProperties = {
  children: ReactNode;
};

export const RegisterPageShell = ({
  children,
}: RegisterPageShellProperties) => {
  return (
    <main className="relative isolate flex flex-1 overflow-hidden">
      <BackgroundSVG />
      <PageContainer className="flex flex-1 flex-col py-5 ">
        <div className="flex flex-1 items-center justify-center ">
          {children}
        </div>
      </PageContainer>
    </main>
  );
};

export type { RegisterPageShellProperties };
