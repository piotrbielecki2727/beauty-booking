"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Label } from "@/components/ui/label";
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type SelectFeedbackMode = "auto" | "overlay" | "reserved";

type SelectOption = {
  isDisabled?: boolean;
  label: ReactNode;
  value: string;
};

type SelectProperties = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "false" | "true";
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: SelectFeedbackMode;
  id?: string;
  isContentAlignedWithTrigger?: boolean;
  isContentPortaled?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  itemClassName?: string;
  label?: ReactNode;
  name?: string;
  onBlur?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: ReactNode;
  triggerClassName?: string;
  value: string;
};

export const Select = ({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": invalid,
  "aria-label": ariaLabel,
  className,
  contentClassName,
  description,
  error,
  feedbackMinLines = 1,
  feedbackMode = "auto",
  id,
  isContentAlignedWithTrigger = false,
  isContentPortaled = true,
  isDisabled = false,
  isRequired = false,
  itemClassName,
  label,
  name,
  onBlur,
  onOpenChange,
  onValueChange,
  options,
  placeholder,
  triggerClassName,
  value,
}: SelectProperties) => {
  const t = useTranslations();
  const generatedId = useId();

  const selectId = id ?? generatedId;
  const isInvalid = Boolean(error) || invalid === true || invalid === "true";
  const isFeedbackOverlay = feedbackMode === "overlay";
  const shouldReserveFeedback = feedbackMode === "reserved";
  const descriptionId = description ? `${selectId}-description` : undefined;
  const errorId =
    error || shouldReserveFeedback ? `${selectId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  const control = (
    <BaseSelect
      disabled={isDisabled}
      id={selectId}
      items={options}
      modal={false}
      name={name}
      onOpenChange={onOpenChange}
      onValueChange={(nextValue: unknown) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue);
        }
      }}
      required={isRequired}
      value={value || null}
    >
      <SelectTrigger
        aria-describedby={describedBy}
        aria-invalid={isInvalid}
        aria-label={ariaLabel}
        className={cn(
          "h-10 w-full border-input bg-card px-3 py-2",
          triggerClassName,
        )}
        onBlur={onBlur}
      >
        <SelectValue placeholder={placeholder ?? t("common.selectPlaceholder")} />
      </SelectTrigger>

      <SelectContent
        alignItemWithTrigger={isContentAlignedWithTrigger}
        className={cn("max-h-56 min-w-(--anchor-width)", contentClassName)}
        isPortaled={isContentPortaled}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            className={itemClassName}
            disabled={option.isDisabled}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );

  if (!label) {
    return control;
  }

  return (
    <div
      className={cn("grid gap-1.5", isFeedbackOverlay && "relative", className)}
      data-invalid={isInvalid ? true : undefined}
    >
      <Label className="gap-1 leading-5" htmlFor={selectId}>
        {label}
        {isRequired ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : null}
      </Label>

      {description ? (
        <FieldFeedback
          className="-mt-1"
          description={description}
          id={descriptionId}
        />
      ) : null}

      {control}

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

export type { SelectFeedbackMode, SelectOption, SelectProperties };
