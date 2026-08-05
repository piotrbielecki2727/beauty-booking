import {
  dayNumberFormatter,
  getAvailabilityIndicatorClassName,
  weekdayShortFormatter,
  type DateGroup,
} from "@/features/booking/utils/dateTimePickerGroups";
import { cn } from "@/lib/utils";

type DateCardsGridProps = {
  dates: DateGroup[];
  onDateSelect: (dateValue: string) => void;
  selectedDate: DateGroup;
};

const DateCardsGrid = ({
  dates,
  onDateSelect,
  selectedDate,
}: DateCardsGridProps) => (
  <section className="grid rounded-lg border border-border/70 bg-card p-3">
    <div className="grid auto-rows-[5.25rem] grid-cols-3 content-start gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {dates.map((date) => {
        const isSelected = date.dateValue === selectedDate.dateValue;
        const parsedDate = new Date(`${date.dateValue}T00:00:00`);

        return (
          <button
            className={cn(
              "grid h-full min-w-0 cursor-pointer content-between gap-1 rounded-lg border px-3 py-2 text-left transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
              isSelected
                ? "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary"
                : "border-border bg-background",
            )}
            key={date.dateValue}
            onClick={() => onDateSelect(date.dateValue)}
            type="button"
          >
            <span
              className={cn(
                "text-xs font-medium",
                isSelected
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              {weekdayShortFormatter.format(parsedDate)}
            </span>
            <span className="text-xl font-semibold leading-none">
              {dayNumberFormatter.format(parsedDate)}
            </span>
            <span
              aria-label={`Dostępność: ${date.slots.length} wolnych terminów`}
              className={cn(
                "block h-1.5 w-full rounded-full",
                getAvailabilityIndicatorClassName(date.slots.length),
                isSelected && "ring-1 ring-primary-foreground/70",
              )}
            />
          </button>
        );
      })}
    </div>
  </section>
);

export { DateCardsGrid };
export type { DateCardsGridProps };
