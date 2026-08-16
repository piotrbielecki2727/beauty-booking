"use client";

import { useId } from "react";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type CheckboxFeedbackMode = "auto" | "reserved";

type CheckboxProperties = Omit<
  ComponentProps<typeof BaseCheckbox>,
  "disabled" | "required"
> & {
  containerClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: CheckboxFeedbackMode;
  isDisabled?: boolean;
  isRequired?: boolean;
  label: ReactNode;
  labelClassName?: string;
};

export const Checkbox = ({
  className,
  containerClassName,
  description,
  error,
  feedbackMinLines = 1,
  feedbackMode = "auto",
  id,
  isDisabled = false,
  isRequired = false,
  label,
  labelClassName,
  ...properties
}: CheckboxProperties) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const shouldReserveFeedback = feedbackMode === "reserved";
  const feedbackId =
    error || description || shouldReserveFeedback
      ? `${checkboxId}-feedback`
      : undefined;

  return (
    <div
      className={cn("grid gap-1.5", containerClassName)}
      data-invalid={error ? true : undefined}
    >
      <div className="flex items-center gap-2.5">
        <BaseCheckbox
          {...properties}
          aria-describedby={feedbackId}
          aria-invalid={Boolean(error)}
          className={className}
          disabled={isDisabled}
          id={checkboxId}
          required={isRequired}
        />

        <Label
          className={cn(
            "block min-w-0 text-sm leading-5 text-foreground",
            "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline",
            isDisabled && "cursor-not-allowed opacity-60",
            labelClassName,
          )}
          htmlFor={checkboxId}
        >
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          ) : null}
        </Label>
      </div>

      <FieldFeedback
        className="pl-7"
        description={description}
        error={error}
        id={feedbackId}
        minLines={feedbackMinLines}
        reserveSpace={shouldReserveFeedback}
      />
    </div>
  );
};

export type { CheckboxFeedbackMode, CheckboxProperties };
