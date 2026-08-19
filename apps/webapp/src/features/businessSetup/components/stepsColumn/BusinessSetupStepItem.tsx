"use client";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/reusable";
import { cn } from "@/lib/utils";

type BusinessSetupStepItemProperties = {
  dirtyLabel: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isDirty: boolean;
  isDisabled: boolean;
  label: string;
  onSelect: () => void;
  stepNumber: number;
};

export const BusinessSetupStepItem = ({
  dirtyLabel,
  isCompleted,
  isCurrent,
  isDirty,
  isDisabled,
  label,
  onSelect,
  stepNumber,
}: BusinessSetupStepItemProperties) => {
  return (
    <li className="min-w-0">
      <Button
        aria-current={isCurrent ? "step" : undefined}
        className={cn(
          "h-10 w-full min-w-0 justify-start gap-2 rounded-md border border-transparent px-2.5 text-sm font-normal",
          "text-copy-muted transition-colors hover:border-line-strong hover:bg-surface-soft hover:text-brand",
          isCurrent && "border-brand bg-brand-soft text-brand",
          isCompleted && "text-brand",
        )}
        isDisabled={isDisabled}
        onClick={onSelect}
        type="button"
        variant="ghost"
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-background text-xs",
            (isCurrent || isCompleted) &&
              "border-brand bg-brand text-copy-inverse",
          )}
        >
          {isCompleted ? (
            <CheckIcon className="size-3" aria-hidden="true" />
          ) : (
            stepNumber
          )}
        </span>
        <span className="truncate">{label}</span>
        {isDirty ? (
          <span
            aria-label={dirtyLabel}
            className="ml-auto size-2 shrink-0 rounded-full bg-warning"
            role="img"
          />
        ) : null}
      </Button>
    </li>
  );
};

export type { BusinessSetupStepItemProperties };
