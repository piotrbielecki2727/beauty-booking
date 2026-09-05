import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type ManagementPageLayoutProperties = {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  headerClassName?: string;
  title: ReactNode;
};

export const ManagementPageLayout = ({
  action,
  children,
  className,
  contentClassName,
  description,
  headerClassName,
  title,
}: ManagementPageLayoutProperties) => (
  <PageContainer
    className={cn(
      "flex min-h-[calc(100dvh-4rem)] flex-col md:min-h-dvh",
      className,
    )}
  >
    <PageHeader
      action={action}
      className={headerClassName}
      description={description}
      title={title}
    />
    <div
      className={cn(
        "mt-6 flex min-h-0 flex-1 flex-col",
        contentClassName,
      )}
    >
      {children}
    </div>
  </PageContainer>
);

export type { ManagementPageLayoutProperties };
