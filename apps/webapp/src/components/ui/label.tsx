"use client";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Label = ({ className, ...properties }: ComponentProps<"label">) => {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-default peer-disabled:opacity-50",
        className,
      )}
      {...properties}
    />
  );
};

export { Label };
