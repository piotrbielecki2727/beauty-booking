import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type PageHeaderProperties = {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
};

export const PageHeader = ({
  action,
  className,
  description,
  title,
}: PageHeaderProperties) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className="font-brand text-3xl font-semibold text-brand">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-copy-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 justify-end">{action}</div> : null}
    </header>
  );
};

export type { PageHeaderProperties };
