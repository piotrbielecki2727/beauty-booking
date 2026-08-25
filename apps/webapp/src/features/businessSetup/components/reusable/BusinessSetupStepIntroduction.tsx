import type { ReactNode } from "react";

type BusinessSetupStepIntroductionProperties = {
  children?: ReactNode;
  description: string;
  title: string;
};

export const BusinessSetupStepIntroduction = ({
  children,
  description,
  title,
}: BusinessSetupStepIntroductionProperties) => {
  return (
    <div className="grid">
      <h2 className="font-brand text-2xl font-semibold text-brand">
        {title}
      </h2>
      <p className="mt-1 max-w-3xl text-sm leading-5 text-copy-muted">
        {description}
      </p>
      {children}
    </div>
  );
};

export type { BusinessSetupStepIntroductionProperties };
