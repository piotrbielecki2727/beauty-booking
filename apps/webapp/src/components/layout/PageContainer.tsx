import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef } from "react";

type PageContainerProperties = ComponentPropsWithoutRef<"div"> & {
  isFullWidth?: boolean;
};

export const PageContainer = ({
  className,
  isFullWidth = false,
  ...props
}: PageContainerProperties) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8",
        isFullWidth ? "max-w-none" : "max-w-7xl",
        className,
      )}
      {...props}
    />
  );
};
