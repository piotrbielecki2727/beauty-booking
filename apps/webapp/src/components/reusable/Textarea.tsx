"use client";

import { forwardRef, useId } from "react";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Label } from "@/components/ui/label";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { InputFeedbackMode } from "@/components/reusable/Input";

type TextareaProperties = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "className" | "disabled" | "required"
> & {
  containerClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: InputFeedbackMode;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
  textareaClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProperties>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      containerClassName,
      description,
      error,
      feedbackMinLines = 1,
      feedbackMode = "auto",
      id,
      isDisabled = false,
      isRequired = false,
      label,
      name,
      textareaClassName,
      ...properties
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const isFeedbackOverlay = feedbackMode === "overlay";
    const descriptionId = description
      ? `${textareaId}-description`
      : undefined;
    const errorId =
      error || feedbackMode === "reserved"
        ? `${textareaId}-error`
        : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div
        className={cn(
          "grid gap-1.5",
          isFeedbackOverlay && "relative",
          containerClassName,
        )}
        data-invalid={error ? true : undefined}
      >
        {label ? (
          <Label className="gap-1 leading-5" htmlFor={textareaId}>
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

        <BaseTextarea
          {...properties}
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          disabled={isDisabled}
          id={textareaId}
          name={name}
          required={isRequired}
          className={cn(
            error && "border-destructive",
            textareaClassName,
          )}
        />

        <FieldFeedback
          className={
            isFeedbackOverlay
              ? "absolute left-0 top-full z-10 mt-0.5 w-full"
              : undefined
          }
          error={error}
          id={errorId}
          minLines={feedbackMinLines}
          reserveSpace={feedbackMode === "reserved"}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export type { TextareaProperties };
