"use client";

import { useId, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import {
  createTimePickerOptions,
  type TimePickerOption,
} from "@/components/reusable/timePickerOptions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { FocusEventHandler, ReactNode } from "react";

type TimePickerFeedbackMode = "auto" | "reserved";

type TimePickerProperties = {
  "aria-describedby"?: string;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  description?: ReactNode;
  endTime?: string;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: TimePickerFeedbackMode;
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
  name?: string;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onValueChange: (value: string) => void;
  options?: TimePickerOption[];
  placeholder?: ReactNode;
  startTime?: string;
  stepMinutes?: number;
  value: string;
};

export const TimePicker = ({
  "aria-describedby": ariaDescribedBy,
  className,
  containerClassName,
  contentClassName,
  description,
  endTime,
  error,
  feedbackMinLines = 1,
  feedbackMode = "auto",
  id,
  isDisabled = false,
  isRequired = false,
  label,
  name,
  onBlur,
  onValueChange,
  options,
  placeholder,
  startTime,
  stepMinutes,
  value,
}: TimePickerProperties) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const generatedId = useId();

  const triggerId = id ?? generatedId;
  const shouldReserveFeedback = feedbackMode === "reserved";
  const feedbackId =
    error || description || shouldReserveFeedback
      ? `${triggerId}-feedback`
      : undefined;
  const describedBy =
    [ariaDescribedBy, feedbackId].filter(Boolean).join(" ") || undefined;
  const timeOptions =
    options ?? createTimePickerOptions({ endTime, startTime, stepMinutes });
  const selectedOption = timeOptions.find((option) => option.value === value);

  return (
    <div
      className={cn("grid gap-1.5", containerClassName)}
      data-invalid={error ? true : undefined}
    >
      {label ? (
        <Label className="gap-1 leading-5" htmlFor={triggerId}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-card px-3 py-2 text-left text-sm text-foreground shadow-xs outline-none transition-colors",
            "hover:bg-[var(--muted-hover,var(--muted))]",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-[var(--ring-soft,var(--ring))]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
            error &&
              "border-destructive ring-3 ring-[var(--destructive-ring,var(--destructive))]",
            !selectedOption && "text-muted-foreground",
            className,
          )}
          disabled={isDisabled}
          id={triggerId}
          name={name}
          onBlur={onBlur}
          type="button"
        >
          <span className="min-w-0 truncate">
            {selectedOption?.label ?? placeholder ?? t("timePicker.placeholder")}
          </span>
          {isOpen ? (
            <ChevronUpIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          ) : (
            <ChevronDownIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={cn("min-w-(--anchor-width)", contentClassName)}
          sideOffset={6}
        >
          <DropdownMenuRadioGroup
            onValueChange={(nextValue) => {
              onValueChange(String(nextValue));
              setIsOpen(false);
            }}
            value={value}
          >
            {timeOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                className={cn(
                  option.value === value &&
                    "bg-[var(--brand-surface,var(--secondary))] text-primary focus:bg-[var(--brand-surface,var(--secondary))] focus:text-primary",
                )}
                disabled={option.isDisabled}
                value={option.value}
              >
                <span className="grid min-w-0 gap-0.5">
                  <span className="min-w-0 truncate">{option.label}</span>
                  {option.description ? (
                    <span className="text-xs font-normal leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <FieldFeedback
        description={description}
        error={error}
        id={feedbackId}
        minLines={feedbackMinLines}
        reserveSpace={shouldReserveFeedback}
      />
    </div>
  );
};

export type { TimePickerFeedbackMode, TimePickerProperties };
