import { useCallback, useMemo, useState } from "react";

import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";
import {
  dayPartOptions,
  getDayPart,
  groupTimeSlotsByMonth,
  type DayPart,
} from "@/features/booking/utils/dateTimePickerGroups";

type UseDateTimePickerStateOptions = {
  selectedTimeSlotId?: string;
  timeSlots: BookingTimeSlot[];
};

const useDateTimePickerState = ({
  selectedTimeSlotId,
  timeSlots,
}: UseDateTimePickerStateOptions) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedDateValue, setSelectedDateValue] = useState<string>();
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>("morning");
  const monthGroups = useMemo(() => groupTimeSlotsByMonth(timeSlots), [timeSlots]);
  const safeMonthIndex = Math.min(selectedMonthIndex, monthGroups.length - 1);
  const selectedMonth = monthGroups[safeMonthIndex];
  const selectedDate =
    selectedMonth?.dates.find((date) => date.dateValue === selectedDateValue) ??
    selectedMonth?.dates.find((date) =>
      date.slots.some((slot) => slot.id === selectedTimeSlotId),
    ) ??
    selectedMonth?.dates[0];
  const shouldShowDayParts = Boolean(selectedDate && selectedDate.slots.length >= 5);
  const availableDayParts = selectedDate
    ? dayPartOptions
        .filter((option) =>
          selectedDate.slots.some((slot) => getDayPart(slot.startTime) === option.id),
        )
        .map((option) => option.id)
    : [];
  const activeDayPart = availableDayParts.includes(selectedDayPart)
    ? selectedDayPart
    : availableDayParts[0];
  const visibleSlots =
    shouldShowDayParts && activeDayPart && selectedDate
      ? selectedDate.slots.filter((slot) => getDayPart(slot.startTime) === activeDayPart)
      : (selectedDate?.slots ?? []);

  const selectPreviousMonth = useCallback(() => {
    setSelectedMonthIndex((currentIndex) => Math.max(0, currentIndex - 1));
    setSelectedDateValue(undefined);
  }, [setSelectedDateValue, setSelectedMonthIndex]);

  const selectNextMonth = useCallback(() => {
    setSelectedMonthIndex((currentIndex) =>
      Math.min(monthGroups.length - 1, currentIndex + 1),
    );
    setSelectedDateValue(undefined);
  }, [monthGroups.length, setSelectedDateValue, setSelectedMonthIndex]);

  return {
    activeDayPart,
    availableDayParts,
    monthGroups,
    safeMonthIndex,
    selectedDate,
    selectedMonth,
    selectNextMonth,
    selectPreviousMonth,
    setSelectedDateValue,
    setSelectedDayPart,
    shouldShowDayParts,
    visibleSlots,
  };
};

export { useDateTimePickerState };
export type { UseDateTimePickerStateOptions };
