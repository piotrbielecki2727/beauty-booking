"use client";

import { useId, useMemo } from "react";
import { useTranslations } from "next-intl";

import { monthTranslationKeys } from "@/components/reusable/datePickerCalendar";
import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Select } from "@/components/reusable/Select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type BirthdayControlFeedbackMode = "auto" | "reserved";

type BirthdayControlValue = {
  day: string;
  month: string;
};

type BirthdayControlProperties = {
  className?: string;
  error?: ReactNode;
  feedbackMode?: BirthdayControlFeedbackMode;
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
  onBlur?: () => void;
  onValueChange: (value: BirthdayControlValue) => void;
  value: BirthdayControlValue;
};

const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getDaysInMonth = (month: string) => {
  const monthIndex = Number(month) - 1;

  return daysInMonths[monthIndex] ?? 31;
};

export const BirthdayControl = ({
  className,
  error,
  feedbackMode = "auto",
  id,
  isDisabled = false,
  isRequired = false,
  label,
  onBlur,
  onValueChange,
  value,
}: BirthdayControlProperties) => {
  const t = useTranslations();
  const generatedId = useId();
  const birthdayId = id ?? generatedId;
  const shouldReserveFeedback = feedbackMode === "reserved";
  const feedbackId =
    error || shouldReserveFeedback ? `${birthdayId}-error` : undefined;
  const daysInSelectedMonth = getDaysInMonth(value.month);
  const monthOptions = useMemo(
    () =>
      monthTranslationKeys.map((month, index) => ({
        label: t(`datePicker.months.${month}`),
        value: String(index + 1),
      })),
    [t],
  );
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInSelectedMonth }, (_, index) => ({
        label: String(index + 1),
        value: String(index + 1),
      })),
    [daysInSelectedMonth],
  );
  const triggerClassName =
    "h-10 border-line-strong bg-card px-3 py-2 text-sm text-copy shadow-xs hover:bg-muted/50 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-datepicker-control-ring";

  const handleMonthChange = (month: string) => {
    onValueChange({
      day: Number(value.day) > getDaysInMonth(month) ? "" : value.day,
      month,
    });
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
      {label ? (
        <Label className="gap-1 leading-5" htmlFor={`${birthdayId}-month`}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <div
        aria-describedby={feedbackId}
        aria-invalid={Boolean(error)}
        className="grid grid-cols-[minmax(0,1fr)_6rem] gap-2"
      >
        <Select
          aria-label={t("birthdayControl.month")}
          contentClassName="max-h-64 border-line-soft bg-card"
          id={`${birthdayId}-month`}
          isContentAlignedWithTrigger={false}
          isDisabled={isDisabled}
          onBlur={onBlur}
          onValueChange={handleMonthChange}
          options={monthOptions}
          placeholder={t("birthdayControl.month")}
          triggerClassName={triggerClassName}
          value={value.month}
        />
        <Select
          aria-label={t("birthdayControl.day")}
          contentClassName="max-h-64 border-line-soft bg-card"
          id={`${birthdayId}-day`}
          isContentAlignedWithTrigger={false}
          isDisabled={isDisabled || !value.month}
          onBlur={onBlur}
          onValueChange={(day) => onValueChange({ ...value, day })}
          options={dayOptions}
          placeholder={t("birthdayControl.day")}
          triggerClassName={triggerClassName}
          value={value.day}
        />
      </div>

      <FieldFeedback
        error={error}
        id={feedbackId}
        reserveSpace={shouldReserveFeedback}
      />
    </div>
  );
};

export type {
  BirthdayControlFeedbackMode,
  BirthdayControlProperties,
  BirthdayControlValue,
};
