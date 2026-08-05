import { Check, Clock } from "lucide-react";

import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";
import { cn } from "@/lib/utils";

type TimeSlotGridProps = {
  onTimeSlotSelect: (timeSlotId: string) => void;
  selectedTimeSlotId?: string;
  visibleSlots: BookingTimeSlot[];
};

const TimeSlotGrid = ({
  onTimeSlotSelect,
  selectedTimeSlotId,
  visibleSlots,
}: TimeSlotGridProps) => (
  <div className="grid content-start gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {visibleSlots.map((slot) => {
      const isSelected = slot.id === selectedTimeSlotId;

      return (
        <button
          aria-checked={isSelected}
          className={cn(
            "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm text-card-foreground transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
            isSelected
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border",
          )}
          key={slot.id}
          onClick={() => onTimeSlotSelect(slot.id)}
          role="radio"
          type="button"
        >
          <span className="inline-flex items-center gap-2">
            <Clock aria-hidden="true" className="size-3.5 text-primary" />
            <span className="font-medium whitespace-nowrap">
              {slot.startTime} - {slot.endTime}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-transparent",
            )}
          >
            <Check className="size-4" />
          </span>
        </button>
      );
    })}
  </div>
);

export { TimeSlotGrid };
export type { TimeSlotGridProps };
