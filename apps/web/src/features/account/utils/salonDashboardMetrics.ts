import type { SalonDashboardSummary } from "@/features/account/types/salonDashboard"
import type { StoredBookingReservation } from "@/features/booking/types/reservation"

const minutesInDay = 24 * 60

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

const startOfWeek = (date: Date) => {
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = startOfDay(date)
  monday.setDate(monday.getDate() + mondayOffset)

  return monday
}

const endOfWeek = (date: Date) => {
  const sunday = startOfWeek(date)
  sunday.setDate(sunday.getDate() + 6)

  return endOfDay(sunday)
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

const parseReservationDate = (reservation: StoredBookingReservation) =>
  new Date(`${reservation.timeSlot.dateValue}T${reservation.timeSlot.startTime}:00`)

const parseReservationEndDate = (reservation: StoredBookingReservation) =>
  new Date(`${reservation.timeSlot.dateValue}T${reservation.timeSlot.endTime}:00`)

const isSameDay = (reservation: StoredBookingReservation, date: Date) => {
  const reservationDate = parseReservationDate(reservation)

  return startOfDay(reservationDate).getTime() === startOfDay(date).getTime()
}

const isBetween = (reservation: StoredBookingReservation, startDate: Date, endDate: Date) => {
  const reservationDate = parseReservationDate(reservation).getTime()

  return reservationDate >= startDate.getTime() && reservationDate <= endDate.getTime()
}

const isCompleted = (reservation: StoredBookingReservation, now: Date) =>
  reservation.status === "completed" ||
  (reservation.status === "confirmed" && parseReservationEndDate(reservation).getTime() < now.getTime())

const isRemaining = (reservation: StoredBookingReservation, now: Date) =>
  (reservation.status === "confirmed" || reservation.status === "pending") &&
  parseReservationDate(reservation).getTime() >= now.getTime()

const sumRevenue = (reservations: StoredBookingReservation[]) =>
  reservations.reduce((total, reservation) => total + reservation.service.priceFrom, 0)

const getMostPopularServiceName = (reservations: StoredBookingReservation[]) => {
  if (reservations.length === 0) {
    return "Brak danych"
  }

  const counts = reservations.reduce<Record<string, { count: number; name: string }>>((serviceCounts, reservation) => {
    const existingCount = serviceCounts[reservation.service.id]?.count ?? 0

    return {
      ...serviceCounts,
      [reservation.service.id]: {
        count: existingCount + 1,
        name: reservation.service.name,
      },
    }
  }, {})

  return Object.values(counts).sort((firstService, secondService) => secondService.count - firstService.count)[0].name
}

const getMonthForecastRevenue = (monthReservations: StoredBookingReservation[], currentDate: Date) => {
  const monthRevenue = sumRevenue(monthReservations.filter((reservation) => reservation.status !== "cancelled"))
  const daysElapsed = currentDate.getDate()
  const daysInMonth = endOfMonth(currentDate).getDate()

  return Math.round((monthRevenue / Math.max(daysElapsed, 1)) * daysInMonth)
}

const getWeeklyOccupancyRate = (weekReservations: StoredBookingReservation[]) => {
  const bookedMinutes = weekReservations
    .filter((reservation) => reservation.status !== "cancelled")
    .reduce((total, reservation) => total + reservation.service.durationMinutes, 0)
  const weeklyCapacityMinutes = 5 * 8 * 60

  return Math.min(Math.round((bookedMinutes / weeklyCapacityMinutes) * 100), 100)
}

const getSalonDashboardSummary = (
  reservations: StoredBookingReservation[],
  selectedDate: Date,
  now = new Date()
): SalonDashboardSummary => {
  const todayReservations = reservations.filter((reservation) => isSameDay(reservation, selectedDate))
  const completedTodayReservations = todayReservations.filter((reservation) => isCompleted(reservation, now))
  const remainingTodayReservations = todayReservations.filter((reservation) => isRemaining(reservation, now))
  const cancelledTodayReservations = todayReservations.filter((reservation) => reservation.status === "cancelled")
  const activeTodayReservations = todayReservations.filter((reservation) => reservation.status !== "cancelled")
  const weekReservations = reservations.filter((reservation) =>
    isBetween(reservation, startOfWeek(selectedDate), endOfWeek(selectedDate))
  )
  const monthReservations = reservations.filter((reservation) =>
    isBetween(reservation, startOfMonth(selectedDate), endOfMonth(selectedDate))
  )

  return {
    monthlyStats: {
      forecastRevenue: getMonthForecastRevenue(monthReservations, selectedDate),
      revenue: sumRevenue(monthReservations.filter((reservation) => reservation.status !== "cancelled")),
    },
    todayMetrics: {
      actualRevenue: {
        amount: sumRevenue(completedTodayReservations),
        label: "Rzeczywisty zysk dzisiaj",
      },
      completedVisits: {
        label: "Wykonane dzisiaj",
        value: completedTodayReservations.length,
      },
      lostRevenue: {
        amount: sumRevenue(cancelledTodayReservations),
        label: "Utracony zysk",
      },
      predictedRevenue: {
        amount: sumRevenue(activeTodayReservations),
        label: "Przewidywany zysk dzisiaj",
      },
      remainingVisits: {
        label: "Pozostałe dzisiaj",
        value: remainingTodayReservations.length,
      },
      visits: {
        label: "Wizyty dzisiaj",
        value: todayReservations.length,
      },
    },
    weeklyStats: {
      occupancyRate: getWeeklyOccupancyRate(weekReservations),
      popularServiceName: getMostPopularServiceName(weekReservations.filter((reservation) => reservation.status !== "cancelled")),
      revenue: sumRevenue(weekReservations.filter((reservation) => reservation.status !== "cancelled")),
      visits: weekReservations.filter((reservation) => reservation.status !== "cancelled").length,
    },
    workTimeTodayMinutes: activeTodayReservations.reduce(
      (total, reservation) => (reservation.service.durationMinutes < minutesInDay ? total + reservation.service.durationMinutes : total),
      0
    ),
  }
}

export { getSalonDashboardSummary }
