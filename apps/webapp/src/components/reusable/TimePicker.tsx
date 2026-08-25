"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, Clock3Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { ScrollArea } from "@/components/reusable/ScrollArea";
import {
  createTimePickerOptions,
  parseTimeToMinutes,
  type TimePickerOption,
} from "@/components/reusable/timePickerOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

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
  onBlur?: () => void;
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
  const [activeHour, setActiveHour] = useState("");
  const generatedId = useId();
  const controlRef = useRef<HTMLDivElement>(null);
  const selectedHourRef = useRef<HTMLButtonElement>(null);
  const selectedMinuteRef = useRef<HTMLButtonElement>(null);

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
  const parsedValue = parseTimeToMinutes(value);
  const selectedHour = parsedValue === null ? "" : value.slice(0, 2);
  const hourOptions = useMemo(
    () => [...new Set(timeOptions.map((option) => option.value.slice(0, 2)))],
    [timeOptions],
  );
  const visibleHour = activeHour || selectedHour || hourOptions[0] || "";
  const minuteOptions = useMemo(
    () =>
      timeOptions.filter(
        (option) => option.value.slice(0, 2) === visibleHour,
      ),
    [timeOptions, visibleHour],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    selectedHourRef.current?.scrollIntoView({ block: "center" });
    selectedMinuteRef.current?.scrollIntoView({ block: "center" });
  }, [isOpen, visibleHour]);

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);

    if (nextIsOpen) {
      setActiveHour(selectedHour || hourOptions[0] || "");
    } else {
      onBlur?.();
    }
  };

  const normalizeInputValue = () => {
    const [hours, minutes] = value.includes(":")
      ? value.split(":")
      : value.length === 3
        ? [value.slice(0, 1), value.slice(1)]
        : value.length === 4
          ? [value.slice(0, 2), value.slice(2)]
          : [];

    if (hours === undefined || minutes === undefined) {
      return;
    }

    const normalizedValue = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    if (parseTimeToMinutes(normalizedValue) !== null) {
      onValueChange(normalizedValue);
    }
  };

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

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <div
          ref={controlRef}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-10 w-full min-w-0 items-center rounded-md border border-input bg-card text-sm text-foreground shadow-xs outline-none transition-colors",
            "hover:bg-[var(--muted-hover,var(--muted))]",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-[var(--ring-soft,var(--ring))]",
            isDisabled && "pointer-events-none cursor-not-allowed opacity-60",
            error &&
              "border-destructive ring-3 ring-[var(--destructive-ring,var(--destructive))]",
            className,
          )}
        >
          <input
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className="w-0 min-w-0 flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground"
            disabled={isDisabled}
            id={triggerId}
            inputMode="numeric"
            maxLength={5}
            name={name}
            onBlur={() => {
              normalizeInputValue();
              onBlur?.();
            }}
            onChange={(event) => {
              const nextValue = event.target.value;

              if (/^[0-9:]*$/.test(nextValue)) {
                onValueChange(nextValue);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                normalizeInputValue();
                event.currentTarget.blur();
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveHour(selectedHour || hourOptions[0] || "");
                setIsOpen(true);
              }
            }}
            placeholder={String(placeholder ?? t("timePicker.placeholderShort"))}
            required={isRequired}
            size={5}
            type="text"
            value={value}
          />

          <PopoverTrigger
            aria-label={t("timePicker.openPicker")}
            className={cn(
              "flex h-full w-12 shrink-0 items-center justify-center gap-1 rounded-r-md border-l border-line-strong text-brand outline-none transition-colors hover:bg-surface-soft focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-brand",
              isOpen && "bg-brand-soft text-brand",
            )}
            disabled={isDisabled}
            title={t("timePicker.openPicker")}
            type="button"
          >
            <Clock3Icon aria-hidden="true" className="size-4" />
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </PopoverTrigger>
        </div>

        <PopoverContent
          align="start"
          anchor={controlRef}
          className={cn(
            "w-(--anchor-width) gap-0 overflow-hidden border-line-soft bg-surface p-0",
            contentClassName,
          )}
        >
          <div className="grid grid-cols-2 border-b border-line-soft bg-surface-soft text-center text-xs font-medium text-copy-muted">
            <span className="px-2 py-2">{t("timePicker.hours")}</span>
            <span className="border-l border-line-soft px-2 py-2">{t("timePicker.minutes")}</span>
          </div>

          <div className="grid h-56 grid-cols-2">
            <ScrollArea contentClassName="grid content-start gap-1 p-1.5 pr-3">
              {hourOptions.map((hour) => (
                <button
                  key={hour}
                  ref={hour === visibleHour ? selectedHourRef : undefined}
                  aria-pressed={hour === visibleHour}
                  className={cn(
                    "h-9 rounded-md text-sm font-medium text-copy outline-none transition-colors hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-brand",
                    hour === visibleHour && "bg-brand text-copy-inverse hover:bg-brand-hover",
                  )}
                  onClick={() => setActiveHour(hour)}
                  type="button"
                >
                  {hour}
                </button>
              ))}
            </ScrollArea>

            <ScrollArea className="border-l border-line-soft" contentClassName="grid content-start gap-1 p-1.5 pr-3">
              {minuteOptions.map((option) => {
                const minute = option.value.slice(3, 5);
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    ref={isSelected ? selectedMinuteRef : undefined}
                    aria-pressed={isSelected}
                    className={cn(
                      "h-9 rounded-md text-sm font-medium text-copy outline-none transition-colors hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
                      isSelected && "bg-brand text-copy-inverse hover:bg-brand-hover",
                    )}
                    disabled={option.isDisabled}
                    onClick={() => {
                      onValueChange(option.value);
                      setIsOpen(false);
                      onBlur?.();
                    }}
                    type="button"
                  >
                    {minute}
                  </button>
                );
              })}
            </ScrollArea>
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

export type { TimePickerFeedbackMode, TimePickerProperties };
