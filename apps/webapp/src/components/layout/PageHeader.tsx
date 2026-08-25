import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type PageHeaderProperties = {
  className?: string;
  description?: ReactNode;
  title: ReactNode;
};

export const PageHeader = ({
  className,
  description,
  title,
}: PageHeaderProperties) => {
  return (
    <header className={cn("space-y-2", className)}>
      <h1 className="font-brand text-3xl font-semibold text-brand">{title}</h1>
      {description ? (
        <p className="text-sm text-copy-muted">{description}</p>
      ) : null}
    </header>
  );
};

export type { PageHeaderProperties };
