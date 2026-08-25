"use client";

import { useId } from "react";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type SegmentedControlFeedbackMode = "auto" | "overlay" | "reserved";

type SegmentedControlOption = {
  isDisabled?: boolean;
  label: ReactNode;
  value: string;
};

type SegmentedControlProperties = {
  className?: string;
  controlClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: SegmentedControlFeedbackMode;
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  optionClassName?: string;
  options: SegmentedControlOption[];
  value: string;
};

export const SegmentedControl = ({
  className,
  controlClassName,
  description,
  error,
  feedbackMinLines = 1,
  feedbackMode = "auto",
  id,
  isDisabled = false,
  isRequired = false,
  label,
  labelClassName,
  name,
  onBlur,
  onValueChange,
  optionClassName,
  options,
  value,
}: SegmentedControlProperties) => {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const isFeedbackOverlay = feedbackMode === "overlay";
  const shouldReserveFeedback = feedbackMode === "reserved";
  const labelId = label ? `${controlId}-label` : undefined;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId =
    error || shouldReserveFeedback ? `${controlId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div
      className={cn("grid gap-1.5", isFeedbackOverlay && "relative", className)}
      data-invalid={error ? true : undefined}
    >
      {label ? (
        <Label className={cn("gap-1 leading-5", labelClassName)} id={labelId}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      {description ? (
        <FieldFeedback
          className="-mt-1"
          description={description}
          id={descriptionId}
        />
      ) : null}

      <div
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
        className={cn(
          "grid h-10 grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2",
          controlClassName,
        )}
        id={controlId}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              aria-checked={isSelected}
              className={cn(
                "h-10 rounded-md border border-line bg-background px-3 text-sm font-medium text-copy-muted shadow-xs transition-colors outline-none hover:bg-surface-soft hover:text-copy focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-[var(--ring-soft)] disabled:pointer-events-none disabled:opacity-50",
                error &&
                  "border-destructive ring-3 ring-[var(--destructive-ring,var(--destructive))]",
                isSelected && "border-brand bg-brand-soft text-brand",
                optionClassName,
              )}
              disabled={isDisabled || option.isDisabled}
              name={name}
              onBlur={onBlur}
              onClick={() => onValueChange(option.value)}
              role="radio"
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <FieldFeedback
        className={
          isFeedbackOverlay
            ? "absolute left-0 top-full z-10 mt-0.5 w-full"
            : undefined
        }
        error={error}
        id={errorId}
        minLines={feedbackMinLines}
        reserveSpace={shouldReserveFeedback}
      />
    </div>
  );
};

export type {
  SegmentedControlFeedbackMode,
  SegmentedControlOption,
  SegmentedControlProperties,
};
