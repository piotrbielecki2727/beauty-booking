import type { ReactNode } from "react";

type BusinessSetupFieldHeaderProperties = {
  description?: ReactNode;
  label: ReactNode;
};

export const BusinessSetupFieldHeader = ({
  description,
  label,
}: BusinessSetupFieldHeaderProperties) => {
  return (
    <div>
      <p className="text-sm font-semibold text-copy">{label}</p>
      {description ? (
        <p className="mt-0.5 text-xs leading-4 text-copy-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export type { BusinessSetupFieldHeaderProperties };
