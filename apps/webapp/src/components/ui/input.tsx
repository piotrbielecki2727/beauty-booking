import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...properties }, ref) => {
    return (
      <input
        data-slot="input"
        ref={ref}
        type={type}
        className={cn(
          "h-10 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none",
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "hover:bg-muted/50",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          className,
        )}
        {...properties}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
