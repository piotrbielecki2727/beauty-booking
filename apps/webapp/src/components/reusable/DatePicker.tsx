"use client";

import { useId, useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/reusable/Button";
import {
  formatDisplayDate,
  formatIsoDate,
  getCalendarDays,
  getInitialViewDate,
  getToday,
  minimumYear,
  monthTranslationKeys,
  parseIsoDate,
  weekDayTranslationKeys,
} from "@/components/reusable/datePickerCalendar";
import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Select } from "@/components/reusable/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type DatePickerFeedbackMode = "auto" | "reserved";
type DatePickerOpenSelect = "month" | "year";

type DatePickerPopoverChangeDetails = {
  preventUnmountOnClose?: () => void;
  reason?: string;
};

type DatePickerProperties = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "false" | "true";
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: DatePickerFeedbackMode;
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const DatePicker = ({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": invalid,
  className,
  containerClassName,
  contentClassName,
  description,
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
  placeholder,
  value,
}: DatePickerProperties) => {
  const locale = useLocale();
  const t = useTranslations();
  const generatedId = useId();
  const [today] = useState(() => getToday());
  const [isOpen, setIsOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState<DatePickerOpenSelect>();
  const [viewDate, setViewDate] = useState(() => getInitialViewDate(value));

  const datePickerId = id ?? generatedId;
  const isInvalid = Boolean(error) || invalid === true || invalid === "true";
  const shouldReserveFeedback = feedbackMode === "reserved";
  const feedbackId =
    error || description || shouldReserveFeedback
      ? `${datePickerId}-feedback`
      : undefined;
  const describedBy =
    [ariaDescribedBy, feedbackId].filter(Boolean).join(" ") || undefined;
  const years = useMemo(
    () =>
      Array.from(
        { length: today.getFullYear() - minimumYear + 1 },
        (_, index) => today.getFullYear() - index,
      ),
    [today],
  );
  const monthOptions = useMemo(
    () =>
      monthTranslationKeys.map((month, index) => ({
        label: t(`datePicker.months.${month}`),
        value: String(index),
      })),
    [t],
  );
  const yearOptions = useMemo(
    () =>
      years.map((year) => ({
        label: year,
        value: String(year),
      })),
    [years],
  );
  const selectedDate = parseIsoDate(value);
  const { emptyDays, monthDays } = getCalendarDays(viewDate, today);
  const isNextMonthDisabled =
    new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1) > today;

  const changeMonth = (offset: number) => {
    setViewDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1),
    );
  };

  const changeViewMonth = (month: number) => {
    setViewDate((currentDate) => new Date(currentDate.getFullYear(), month, 1));
  };

  const changeViewYear = (year: number) => {
    setViewDate((currentDate) => new Date(year, currentDate.getMonth(), 1));
  };

  const selectDate = (date: Date) => {
    onValueChange(formatIsoDate(date));
    setIsOpen(false);
    onBlur?.();
  };

  const handleOpenChange = (
    nextIsOpen: boolean,
    eventDetails?: DatePickerPopoverChangeDetails,
  ) => {
    const nextDate = parseIsoDate(value);

    if (
      !nextIsOpen &&
      openSelect &&
      (eventDetails?.reason === "outside-press" ||
        eventDetails?.reason === "focus-out")
    ) {
      eventDetails.preventUnmountOnClose?.();
      return;
    }

    setIsOpen(nextIsOpen);

    if (nextIsOpen && nextDate) {
      setViewDate(nextDate);
    }

    if (!nextIsOpen) {
      onBlur?.();
    }
  };

  return (
    <div
      className={cn("grid gap-1.5", containerClassName)}
      data-invalid={isInvalid ? true : undefined}
    >
      {label ? (
        <Label className="gap-1 leading-5" htmlFor={datePickerId}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="text-danger-text">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <input
          name={name}
          readOnly
          required={isRequired}
          type="hidden"
          value={value}
        />
        <PopoverTrigger
          aria-describedby={describedBy}
          aria-invalid={isInvalid}
          className={cn(
            "flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-line-strong bg-surface px-3 py-2 text-left text-sm text-copy shadow-xs outline-none transition-colors",
            "hover:bg-datepicker-control-hover",
            "focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-datepicker-control-ring",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
            isInvalid && "border-danger-text ring-3 ring-danger-border",
            !value && "text-copy-muted",
            className,
          )}
          disabled={isDisabled}
          id={datePickerId}
          type="button"
        >
          <span className="min-w-0 truncate">
            {formatDisplayDate(
              value,
              placeholder ?? t("datePicker.placeholder"),
              locale,
            )}
          </span>
          <CalendarDaysIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-brand"
          />
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-[min(calc(100vw-2rem),22rem)] border-line-soft bg-surface",
            contentClassName,
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Button
              aria-label={t("datePicker.previousMonth")}
              className="text-brand hover:bg-datepicker-option-hover hover:text-brand-hover"
              onClick={() => changeMonth(-1)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>

            <div className="grid flex-1 grid-cols-[minmax(0,1fr)_5.75rem] gap-2">
              <Select
                aria-label={t("datePicker.month")}
                contentClassName="max-h-64 border-line-soft bg-surface"
                isContentAlignedWithTrigger={false}
                onOpenChange={(nextIsOpen) =>
                  setOpenSelect(nextIsOpen ? "month" : undefined)
                }
                onValueChange={(nextMonth) =>
                  changeViewMonth(Number(nextMonth))
                }
                options={monthOptions}
                itemClassName="focus:bg-datepicker-option-hover focus:text-brand data-selected:bg-datepicker-option-selected data-selected:text-datepicker-option-selected-foreground"
                triggerClassName="h-9 border-line-soft bg-canvas px-3 hover:border-brand hover:bg-datepicker-control-hover focus-visible:border-brand focus-visible:ring-datepicker-control-ring data-popup-open:border-brand"
                value={String(viewDate.getMonth())}
              />

              <Select
                aria-label={t("datePicker.year")}
                contentClassName="max-h-64 min-w-[6rem] border-line-soft bg-surface"
                isContentAlignedWithTrigger={false}
                onOpenChange={(nextIsOpen) =>
                  setOpenSelect(nextIsOpen ? "year" : undefined)
                }
                onValueChange={(nextYear) => changeViewYear(Number(nextYear))}
                options={yearOptions}
                itemClassName="focus:bg-datepicker-option-hover focus:text-brand data-selected:bg-datepicker-option-selected data-selected:text-datepicker-option-selected-foreground"
                triggerClassName="h-9 border-line-soft bg-canvas px-3 hover:border-brand hover:bg-datepicker-control-hover focus-visible:border-brand focus-visible:ring-datepicker-control-ring data-popup-open:border-brand"
                value={String(viewDate.getFullYear())}
              />
            </div>

            <Button
              aria-label={t("datePicker.nextMonth")}
              className="text-brand hover:bg-datepicker-option-hover hover:text-brand-hover"
              isDisabled={isNextMonthDisabled}
              onClick={() => changeMonth(1)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDayTranslationKeys.map((dayLabel) => (
              <span
                key={dayLabel}
                className="grid h-8 place-items-center text-xs font-medium text-copy-muted"
              >
                {t(`datePicker.weekDays.${dayLabel}`)}
              </span>
            ))}

            {emptyDays.map((_, index) => (
              <span aria-hidden="true" className="h-9" key={`empty-${index}`} />
            ))}

            {monthDays.map((calendarDay) => {
              const isSelected = selectedDate
                ? formatIsoDate(selectedDate) === calendarDay.key
                : false;

              return (
                <Button
                  key={calendarDay.key}
                  aria-pressed={isSelected}
                  className={cn(
                    "h-9 rounded-full px-0 hover:bg-datepicker-option-hover hover:text-brand",
                    isSelected &&
                      "bg-datepicker-option-selected text-datepicker-option-selected-foreground hover:bg-datepicker-option-selected-hover hover:text-datepicker-option-selected-foreground",
                  )}
                  isDisabled={calendarDay.isDisabled}
                  onClick={() => selectDate(calendarDay.date)}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                >
                  {calendarDay.day}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

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

export type { DatePickerFeedbackMode, DatePickerProperties };
