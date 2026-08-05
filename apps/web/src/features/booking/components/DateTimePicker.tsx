"use client";

import { CalendarDays } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingState } from "@/components/common/loading-state";
import { DateCardsGrid } from "@/features/booking/components/DateCardsGrid";
import { DateTimePickerHeader } from "@/features/booking/components/DateTimePickerHeader";
import { DayPartSelector } from "@/features/booking/components/DayPartSelector";
import { TimeSlotGrid } from "@/features/booking/components/TimeSlotGrid";
import { useDateTimePickerState } from "@/features/booking/hooks/useDateTimePickerState";
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";
import { cn } from "@/lib/utils";

type DateTimePickerProps = {
  className?: string;
  errorMessage?: string;
  isError?: boolean;
  isLoading?: boolean;
  onTimeSlotSelect: (timeSlotId: string) => void;
  selectedTimeSlotId?: string;
  timeSlots: BookingTimeSlot[];
};

const DateTimePicker = ({
  className,
  errorMessage,
  isError = false,
  isLoading = false,
  onTimeSlotSelect,
  selectedTimeSlotId,
  timeSlots,
}: DateTimePickerProps) => {
  const dateTimePicker = useDateTimePickerState({
    selectedTimeSlotId,
    timeSlots,
  });

  if (isLoading) {
    return (
      <LoadingState
        className={className}
        message="Ładowanie terminów"
        variant="skeleton"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        className={className}
        description={errorMessage ?? "Spróbuj odświeżyć stronę albo wybierz inną usługę."}
        title="Nie udało się wyświetlić terminów"
      />
    );
  }

  if (
    timeSlots.length === 0 ||
    dateTimePicker.monthGroups.length === 0 ||
    !dateTimePicker.selectedDate ||
    !dateTimePicker.selectedMonth
  ) {
    return (
      <EmptyState
        className={className}
        description="Wybierz inną usługę lub wróć później, aby sprawdzić nowe dostępne godziny."
        icon={<CalendarDays aria-hidden="true" />}
        title="Brak wolnych terminów"
      />
    );
  }

  return (
    <div className={cn("grid gap-4", className)} role="radiogroup" aria-label="Wybór terminu">
      <DateTimePickerHeader
        monthGroups={dateTimePicker.monthGroups}
        onNextMonth={dateTimePicker.selectNextMonth}
        onPreviousMonth={dateTimePicker.selectPreviousMonth}
        safeMonthIndex={dateTimePicker.safeMonthIndex}
        selectedMonth={dateTimePicker.selectedMonth}
      />

      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <DateCardsGrid
          dates={dateTimePicker.selectedMonth.dates}
          onDateSelect={dateTimePicker.setSelectedDateValue}
          selectedDate={dateTimePicker.selectedDate}
        />

        <section className="grid content-start gap-3 rounded-lg border border-border/70 bg-card p-3">
          <div className="grid gap-1">
            <p className="font-medium">Godzina wizyty</p>
            <p className="text-sm text-muted-foreground">
              {dateTimePicker.selectedDate.dateLabel}
            </p>
          </div>

          {dateTimePicker.shouldShowDayParts ? (
            <DayPartSelector
              activeDayPart={dateTimePicker.activeDayPart}
              availableDayParts={dateTimePicker.availableDayParts}
              onDayPartSelect={dateTimePicker.setSelectedDayPart}
            />
          ) : null}

          <TimeSlotGrid
            onTimeSlotSelect={onTimeSlotSelect}
            selectedTimeSlotId={selectedTimeSlotId}
            visibleSlots={dateTimePicker.visibleSlots}
          />
        </section>
      </div>
    </div>
  );
};

export { DateTimePicker };
export type { DateTimePickerProps };
