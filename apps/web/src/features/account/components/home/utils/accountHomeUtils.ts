import type { AccountSession } from "@/features/account/types/accountSession";
import type {
  BookingReservationStatus,
  StoredBookingReservation,
} from "@/features/booking/types/reservation";

type PlanVisitColumn = "active" | "cancelled" | "completed";

type PlanVisitColumnConfig = {
  emptyText: string;
  id: PlanVisitColumn;
  title: string;
};

type PlanStatusOption = {
  label: string;
  value: BookingReservationStatus;
};

const todayFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateValue = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
};

const isSameDate = (firstDate: Date, secondDate: Date) =>
  startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime();

const parseReservationDate = (reservation: StoredBookingReservation) =>
  new Date(
    `${reservation.timeSlot.dateValue}T${reservation.timeSlot.startTime}:00`,
  );

const parseReservationEndDate = (reservation: StoredBookingReservation) =>
  new Date(
    `${reservation.timeSlot.dateValue}T${reservation.timeSlot.endTime}:00`,
  );

const sortReservationsAscending = (reservations: StoredBookingReservation[]) =>
  [...reservations].sort((firstReservation, secondReservation) => {
    const firstDate = parseReservationDate(firstReservation).getTime();
    const secondDate = parseReservationDate(secondReservation).getTime();

    return firstDate - secondDate;
  });

const sortReservationsDescending = (reservations: StoredBookingReservation[]) =>
  [...reservations].sort((firstReservation, secondReservation) => {
    const firstDate = parseReservationDate(firstReservation).getTime();
    const secondDate = parseReservationDate(secondReservation).getTime();

    return secondDate - firstDate;
  });

const getDaysBetween = (firstDate: Date, secondDate: Date) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const firstStart = startOfDay(firstDate).getTime();
  const secondStart = startOfDay(secondDate).getTime();

  return Math.round((firstStart - secondStart) / millisecondsInDay);
};

const getUpcomingVisitText = (
  reservation: StoredBookingReservation | undefined,
  today: Date,
) => {
  if (!reservation) {
    return "Brak nadchodzącej wizyty";
  }

  const daysUntilVisit = getDaysBetween(
    parseReservationDate(reservation),
    today,
  );

  if (daysUntilVisit === 0) {
    return `Dzisiaj, ${reservation.timeSlot.startTime}`;
  }

  if (daysUntilVisit === 1) {
    return `Jutro, ${reservation.timeSlot.startTime}`;
  }

  return `Za ${daysUntilVisit} dni, ${reservation.timeSlot.startTime}`;
};

const getLastVisitText = (
  reservation: StoredBookingReservation | undefined,
  today: Date,
) => {
  if (!reservation) {
    return "Brak zakończonych wizyt";
  }

  const daysSinceVisit = Math.abs(
    getDaysBetween(parseReservationDate(reservation), today),
  );

  if (daysSinceVisit === 0) {
    return "Ostatnia wizyta była dzisiaj";
  }

  if (daysSinceVisit === 1) {
    return "1 dzień od ostatniej wizyty";
  }

  return `${daysSinceVisit} dni od ostatniej wizyty`;
};

const getGreeting = (accountSession: AccountSession) => {
  const firstName = accountSession.firstName.trim();

  return firstName ? `Cześć, ${firstName}!` : "Cześć!";
};

const mergeReservationsWithMocks = (
  storedReservations: StoredBookingReservation[],
  mockReservations: StoredBookingReservation[],
) => {
  const storedReservationIds = new Set(
    storedReservations.map((reservation) => reservation.id),
  );

  return [
    ...storedReservations,
    ...mockReservations.filter(
      (reservation) => !storedReservationIds.has(reservation.id),
    ),
  ];
};

const getPlanVisitStatus = (
  reservation: StoredBookingReservation,
  currentDate: Date,
) => {
  if (reservation.status === "cancelled") {
    return {
      cardClassName: "border-destructive/40 bg-destructive/10",
      className: "border-destructive/30 bg-destructive/15 text-destructive",
      column: "cancelled" as const,
      label: "Odwołana",
    };
  }

  if (
    reservation.status === "completed" ||
    parseReservationEndDate(reservation).getTime() < currentDate.getTime()
  ) {
    return {
      cardClassName: "bg-muted/35 text-muted-foreground opacity-80",
      className: "border-muted-foreground/20 bg-muted text-muted-foreground",
      column: "completed" as const,
      label: "Wykonana",
    };
  }

  return {
    cardClassName: "bg-background/70",
    className: "border-primary/30 bg-primary/10 text-primary",
    column: "active" as const,
    label: "Aktywna",
  };
};

const planVisitColumns: PlanVisitColumnConfig[] = [
  {
    emptyText: "Brak aktywnych wizyt na wybrany dzień.",
    id: "active",
    title: "Aktywne",
  },
  {
    emptyText: "Brak wykonanych wizyt na wybrany dzień.",
    id: "completed",
    title: "Wykonane",
  },
  {
    emptyText: "Brak odwołanych wizyt na wybrany dzień.",
    id: "cancelled",
    title: "Odwołane",
  },
];

const planStatusOptions: PlanStatusOption[] = [
  {
    label: "Aktywna",
    value: "confirmed",
  },
  {
    label: "Wykonana",
    value: "completed",
  },
  {
    label: "Odwołana",
    value: "cancelled",
  },
];

export {
  addDays,
  formatDateValue,
  fullDateFormatter,
  getDaysBetween,
  getGreeting,
  getLastVisitText,
  getPlanVisitStatus,
  getUpcomingVisitText,
  isSameDate,
  mergeReservationsWithMocks,
  monthFormatter,
  parseReservationDate,
  planStatusOptions,
  planVisitColumns,
  sortReservationsAscending,
  sortReservationsDescending,
  startOfDay,
  todayFormatter,
};

export type { PlanStatusOption, PlanVisitColumn, PlanVisitColumnConfig };
