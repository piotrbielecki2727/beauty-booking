import { ChevronLeft, ChevronRight } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import {
  formatMonthLabel,
  type MonthGroup,
} from "@/features/booking/utils/dateTimePickerGroups";

type DateTimePickerHeaderProps = {
  monthGroups: MonthGroup[];
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  safeMonthIndex: number;
  selectedMonth: MonthGroup;
};

const DateTimePickerHeader = ({
  monthGroups,
  onNextMonth,
  onPreviousMonth,
  safeMonthIndex,
  selectedMonth,
}: DateTimePickerHeaderProps) => (
  <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="grid gap-1">
      <p className="text-sm font-medium">Dostępne terminy</p>
      <p className="text-sm text-muted-foreground">
        Wybierz miesiąc, dzień i godzinę wizyty.
      </p>
    </div>
    <div className="grid grid-cols-[2rem_minmax(10rem,1fr)_2rem] items-center gap-2 sm:min-w-64">
      <AppButton
        aria-label="Poprzedni miesiąc"
        disabled={safeMonthIndex === 0}
        onClick={onPreviousMonth}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <ChevronLeft aria-hidden="true" />
      </AppButton>
      <div className="rounded-full border border-border/70 bg-background px-4 py-1.5 text-center text-sm font-semibold shadow-sm">
        {formatMonthLabel(selectedMonth.monthLabel)}
      </div>
      <AppButton
        aria-label="Następny miesiąc"
        disabled={safeMonthIndex === monthGroups.length - 1}
        onClick={onNextMonth}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <ChevronRight aria-hidden="true" />
      </AppButton>
    </div>
  </div>
);

export { DateTimePickerHeader };
export type { DateTimePickerHeaderProps };
