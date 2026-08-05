"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { AppButton } from "@/components/common/app-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDays,
  formatDateValue,
  fullDateFormatter,
  isSameDate,
  monthFormatter,
} from "@/features/account/components/home/utils/accountHomeUtils";

type PlanDayPickerProps = {
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  today: Date;
};

type PlanCalendarDay = {
  date?: Date;
  key: string;
};

const getPlanCalendarDays = (viewDate: Date): PlanCalendarDay[] => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const emptyDaysCount = firstDay === 0 ? 6 : firstDay - 1;
  const emptyDays = Array.from({ length: emptyDaysCount }, (_, index) => ({
    key: `empty-${year}-${month}-${index}`,
  }));
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);

    return {
      date,
      key: formatDateValue(date),
    };
  });

  return [...emptyDays, ...monthDays];
};

const PlanDayPicker = ({
  onDateChange,
  selectedDate,
  today,
}: PlanDayPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate);
  const calendarDays = useMemo(() => getPlanCalendarDays(viewDate), [viewDate]);

  const selectDate = (date: Date) => {
    setViewDate(date);
    onDateChange(date);
    setIsOpen(false);
  };

  return (
    <section className="rounded-lg border border-border/70 bg-card px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-primary">Wybór dnia</p>
          <p className="text-base font-medium">
            {fullDateFormatter.format(selectedDate)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <AppButton
            onClick={() => selectDate(addDays(today, -1))}
            type="button"
            variant="outline"
          >
            Wczoraj
          </AppButton>
          <AppButton
            onClick={() => selectDate(today)}
            type="button"
            variant="outline"
          >
            Dzisiaj
          </AppButton>
          <AppButton
            onClick={() => selectDate(addDays(today, 1))}
            type="button"
            variant="outline"
          >
            Jutro
          </AppButton>

          <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger className="group/button inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-4xl border border-border bg-background px-3 text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
              <CalendarDays aria-hidden="true" className="size-4" />
              Kalendarz
            </PopoverTrigger>
            <PopoverContent className="w-[min(calc(100vw-2rem),22rem)]">
              <div className="flex items-center justify-between gap-3">
                <AppButton
                  aria-label="Poprzedni miesiąc"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <ChevronLeft aria-hidden="true" />
                </AppButton>
                <p className="font-medium capitalize">
                  {monthFormatter.format(viewDate)}
                </p>
                <AppButton
                  aria-label="Następny miesiąc"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <ChevronRight aria-hidden="true" />
                </AppButton>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((calendarDay) => {
                  const date = calendarDay.date;

                  return date ? (
                    <button
                      className={`h-9 rounded-lg border text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/10 ${
                        isSameDate(date, selectedDate)
                          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-transparent bg-transparent"
                      }`}
                      key={calendarDay.key}
                      onClick={() => selectDate(date)}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <span aria-hidden="true" key={calendarDay.key} />
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
};

export { PlanDayPicker };
export type { PlanCalendarDay, PlanDayPickerProps };
