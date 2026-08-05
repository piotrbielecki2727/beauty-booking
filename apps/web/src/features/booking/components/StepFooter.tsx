import type { ReactNode } from "react";

type StepFooterProps = {
  children: ReactNode;
};

const StepFooter = ({ children }: StepFooterProps) => (
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
    {children}
  </div>
);

export { StepFooter };
export type { StepFooterProps };
