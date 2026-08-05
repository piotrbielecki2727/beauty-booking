import {
  dayPartOptions,
  type DayPart,
} from "@/features/booking/utils/dateTimePickerGroups";
import { cn } from "@/lib/utils";

type DayPartSelectorProps = {
  activeDayPart?: DayPart;
  availableDayParts: DayPart[];
  onDayPartSelect: (dayPart: DayPart) => void;
};

const DayPartSelector = ({
  activeDayPart,
  availableDayParts,
  onDayPartSelect,
}: DayPartSelectorProps) => (
  <div className="grid gap-2 sm:grid-cols-3">
    {dayPartOptions.map((option) => {
      const isAvailable = availableDayParts.includes(option.id);
      const isActive = option.id === activeDayPart;

      return (
        <button
          className={cn(
            "h-9 rounded-full border px-3 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-45",
            isActive
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/45 hover:bg-primary/5 hover:text-foreground",
          )}
          disabled={!isAvailable}
          key={option.id}
          onClick={() => onDayPartSelect(option.id)}
          type="button"
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export { DayPartSelector };
export type { DayPartSelectorProps };
