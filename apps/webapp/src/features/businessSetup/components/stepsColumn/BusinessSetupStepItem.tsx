"use client";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/reusable";
import { cn } from "@/lib/utils";

type BusinessSetupStepItemProperties = {
  description: string;
  dirtyLabel: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isDirty: boolean;
  isDisabled: boolean;
  label: string;
  onSelect: () => void;
  orientation?: "horizontal" | "vertical";
  stepNumber: number;
};

export const BusinessSetupStepItem = ({
  description,
  dirtyLabel,
  isCompleted,
  isCurrent,
  isDirty,
  isDisabled,
  label,
  onSelect,
  orientation = "horizontal",
  stepNumber,
}: BusinessSetupStepItemProperties) => {
  return (
    <li
      className={cn(
        "flex min-w-0",
        orientation === "horizontal" && "w-64 shrink-0",
      )}
    >
      <Button
        aria-label={isDirty ? `${label}. ${dirtyLabel}` : label}
        aria-current={isCurrent ? "step" : undefined}
        className={cn(
          "h-auto w-full min-w-0 items-start justify-start whitespace-normal rounded-lg border border-line bg-background text-left font-normal text-copy shadow-none",
          orientation === "vertical"
            ? "min-h-0 gap-3 p-3"
            : "min-h-24 gap-4 p-4",
          "transition-[border-color,background-color,box-shadow,color] duration-200 hover:border-line-strong hover:bg-surface-soft hover:text-copy hover:shadow-sm",
          "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/30",
          isCurrent &&
            "border-brand bg-brand-soft shadow-sm hover:border-brand hover:bg-brand-soft",
        )}
        isDisabled={isDisabled}
        onClick={onSelect}
        type="button"
        variant="ghost"
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-background text-sm font-semibold text-copy-muted",
            (isCurrent || isCompleted) &&
              "border-brand bg-brand text-copy-inverse",
          )}
        >
          {isCompleted && !isCurrent ? (
            <CheckIcon className="size-4" aria-hidden="true" />
          ) : (
            stepNumber
          )}
        </span>
        <span className="grid min-w-0 flex-1 gap-1">
          <span
            className={cn(
              "text-base font-semibold text-copy",
              isCurrent && "text-brand",
            )}
          >
            {stepNumber}. {label}
          </span>
          <span className="text-sm leading-5 text-copy-muted">
            {description}
          </span>
        </span>
      </Button>
    </li>
  );
};

export type { BusinessSetupStepItemProperties };
