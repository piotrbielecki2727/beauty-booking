import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type BooleanStatusBadgeProperties = {
  className?: string;
  falseLabel: string;
  trueLabel: string;
  value: boolean;
};

export const BooleanStatusBadge = ({
  className,
  falseLabel,
  trueLabel,
  value,
}: BooleanStatusBadgeProperties) => (
  <span
    className={cn(
      "inline-flex size-7 items-center justify-center rounded-md border",
      value
        ? "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success"
        : "border-danger-border bg-danger-surface text-danger-text",
      className,
    )}
  >
    {value ? (
      <CheckIcon className="size-4" aria-hidden="true" strokeWidth={2.5} />
    ) : (
      <XIcon className="size-4" aria-hidden="true" strokeWidth={2.75} />
    )}
    <span className="sr-only">{value ? trueLabel : falseLabel}</span>
  </span>
);

export type { BooleanStatusBadgeProperties };
