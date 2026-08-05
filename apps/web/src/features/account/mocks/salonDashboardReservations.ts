import { mockBeautyServices } from "@/features/booking/mocks/services"
import { mockStaffMembers } from "@/features/booking/mocks/staff"
import type { StoredBookingReservation } from "@/features/booking/types/reservation"

const formatDateValue = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")

  return `${date.getFullYear()}-${month}-${day}`
}

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

const getDateLabel = (date: Date, today: Date) => {
  if (formatDateValue(date) === formatDateValue(today)) {
    return "Dzisiaj"
  }

  if (formatDateValue(date) === formatDateValue(addDays(today, 1))) {
    return "Jutro"
  }

  return new Intl.DateTimeFormat("pl-PL", { weekday: "long" }).format(date)
}

const createMockReservation = ({
  customerName,
  date,
  email,
  id,
  phone,
  serviceIndex,
  staffIndex,
  startTime,
  status = "confirmed",
  today,
}: {
  customerName: string
  date: Date
  email: string
  id: string
  phone: string
  serviceIndex: number
  staffIndex: number
  startTime: string
  status?: StoredBookingReservation["status"]
  today: Date
}): StoredBookingReservation => {
  const service = mockBeautyServices[serviceIndex]
  const [firstName, ...lastNameParts] = customerName.split(" ")
  const startDate = new Date(`${formatDateValue(date)}T${startTime}:00`)
  const endDate = new Date(startDate)
  endDate.setMinutes(endDate.getMinutes() + service.durationMinutes)
  const endHours = `${endDate.getHours()}`.padStart(2, "0")
  const endMinutes = `${endDate.getMinutes()}`.padStart(2, "0")

  return {
    accountId: `mock-account-${id}`,
    consents: {
      emailNotifications: Boolean(email),
      phoneNotifications: true,
      termsAccepted: true,
    },
    createdAt: new Date(today).toISOString(),
    customerDetails: {
      email,
      firstName,
      lastName: lastNameParts.join(" "),
      note: "",
      phone,
    },
    id,
    service,
    staffMember: mockStaffMembers[staffIndex],
    status,
    timeSlot: {
      dateLabel: getDateLabel(date, today),
      dateValue: formatDateValue(date),
      endTime: `${endHours}:${endMinutes}`,
      id: `${id}-slot`,
      serviceId: service.id,
      staffMemberIds: [mockStaffMembers[staffIndex].id],
      startTime,
    },
  }
}

type MockReservationSeed = {
  customerName: string
  dayOffset: number
  id: string
  serviceIndex: number
  staffIndex: number
  startTime: string
  status?: StoredBookingReservation["status"]
}

const denseMockReservationSeeds: MockReservationSeed[] = [
  {
    customerName: "Agnieszka Duda",
    dayOffset: 1,
    id: "mock-aug-05-0630",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "06:30",
    status: "completed",
  },
  {
    customerName: "Karolina Malinowska",
    dayOffset: 1,
    id: "mock-aug-05-0745",
    serviceIndex: 2,
    staffIndex: 2,
    startTime: "07:45",
    status: "completed",
  },
  {
    customerName: "Marta Olszewska",
    dayOffset: 1,
    id: "mock-aug-05-0900",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "09:00",
  },
  {
    customerName: "Julia Kamińska",
    dayOffset: 1,
    id: "mock-aug-05-1015",
    serviceIndex: 0,
    staffIndex: 1,
    startTime: "10:15",
  },
  {
    customerName: "Dominika Witkowska",
    dayOffset: 1,
    id: "mock-aug-05-1130",
    serviceIndex: 3,
    staffIndex: 3,
    startTime: "11:30",
    status: "pending",
  },
  {
    customerName: "Ewelina Nowak",
    dayOffset: 1,
    id: "mock-aug-05-1245",
    serviceIndex: 4,
    staffIndex: 4,
    startTime: "12:45",
  },
  {
    customerName: "Paulina Król",
    dayOffset: 1,
    id: "mock-aug-05-1400",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "14:00",
  },
  {
    customerName: "Monika Piasecka",
    dayOffset: 1,
    id: "mock-aug-05-1515",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "15:15",
  },
  {
    customerName: "Barbara Zając",
    dayOffset: 1,
    id: "mock-aug-05-1630",
    serviceIndex: 2,
    staffIndex: 2,
    startTime: "16:30",
    status: "cancelled",
  },
  {
    customerName: "Wiktoria Mazur",
    dayOffset: 1,
    id: "mock-aug-05-1745",
    serviceIndex: 0,
    staffIndex: 1,
    startTime: "17:45",
  },
  {
    customerName: "Klaudia Woźniak",
    dayOffset: 1,
    id: "mock-aug-05-1900",
    serviceIndex: 3,
    staffIndex: 3,
    startTime: "19:00",
  },
  {
    customerName: "Aleksandra Lewandowska",
    dayOffset: 1,
    id: "mock-aug-05-2030",
    serviceIndex: 2,
    staffIndex: 4,
    startTime: "20:30",
    status: "pending",
  },
  {
    customerName: "Natalia Zielińska",
    dayOffset: 2,
    id: "mock-aug-06-0600",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "06:00",
    status: "completed",
  },
  {
    customerName: "Magdalena Wiśniewska",
    dayOffset: 2,
    id: "mock-aug-06-0715",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "07:15",
    status: "completed",
  },
  {
    customerName: "Zuzanna Janowska",
    dayOffset: 2,
    id: "mock-aug-06-0845",
    serviceIndex: 4,
    staffIndex: 3,
    startTime: "08:45",
  },
  {
    customerName: "Weronika Sobczak",
    dayOffset: 2,
    id: "mock-aug-06-1000",
    serviceIndex: 0,
    staffIndex: 1,
    startTime: "10:00",
  },
  {
    customerName: "Patrycja Dąbrowska",
    dayOffset: 2,
    id: "mock-aug-06-1115",
    serviceIndex: 2,
    staffIndex: 2,
    startTime: "11:15",
    status: "pending",
  },
  {
    customerName: "Joanna Kaczmarek",
    dayOffset: 2,
    id: "mock-aug-06-1230",
    serviceIndex: 3,
    staffIndex: 4,
    startTime: "12:30",
  },
  {
    customerName: "Katarzyna Wrona",
    dayOffset: 2,
    id: "mock-aug-06-1345",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "13:45",
  },
  {
    customerName: "Lena Kubiak",
    dayOffset: 2,
    id: "mock-aug-06-1500",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "15:00",
    status: "cancelled",
  },
  {
    customerName: "Martyna Pawlak",
    dayOffset: 2,
    id: "mock-aug-06-1615",
    serviceIndex: 4,
    staffIndex: 3,
    startTime: "16:15",
  },
  {
    customerName: "Sylwia Cieślak",
    dayOffset: 2,
    id: "mock-aug-06-1730",
    serviceIndex: 2,
    staffIndex: 4,
    startTime: "17:30",
  },
  {
    customerName: "Maja Wójcik",
    dayOffset: 2,
    id: "mock-aug-06-1845",
    serviceIndex: 0,
    staffIndex: 1,
    startTime: "18:45",
  },
  {
    customerName: "Aneta Lis",
    dayOffset: 2,
    id: "mock-aug-06-2015",
    serviceIndex: 3,
    staffIndex: 3,
    startTime: "20:15",
    status: "pending",
  },
  {
    customerName: "Dorota Mazur",
    dayOffset: 3,
    id: "mock-aug-07-0630",
    serviceIndex: 2,
    staffIndex: 2,
    startTime: "06:30",
    status: "completed",
  },
  {
    customerName: "Eliza Kowal",
    dayOffset: 3,
    id: "mock-aug-07-0730",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "07:30",
    status: "completed",
  },
  {
    customerName: "Iga Malec",
    dayOffset: 3,
    id: "mock-aug-07-0900",
    serviceIndex: 3,
    staffIndex: 4,
    startTime: "09:00",
  },
  {
    customerName: "Olga Michalska",
    dayOffset: 3,
    id: "mock-aug-07-1015",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "10:15",
  },
  {
    customerName: "Nina Wesołowska",
    dayOffset: 3,
    id: "mock-aug-07-1130",
    serviceIndex: 4,
    staffIndex: 3,
    startTime: "11:30",
    status: "cancelled",
  },
  {
    customerName: "Roksana Baran",
    dayOffset: 3,
    id: "mock-aug-07-1245",
    serviceIndex: 0,
    staffIndex: 1,
    startTime: "12:45",
  },
  {
    customerName: "Justyna Sowa",
    dayOffset: 3,
    id: "mock-aug-07-1400",
    serviceIndex: 2,
    staffIndex: 2,
    startTime: "14:00",
    status: "pending",
  },
  {
    customerName: "Kinga Adamczyk",
    dayOffset: 3,
    id: "mock-aug-07-1515",
    serviceIndex: 3,
    staffIndex: 4,
    startTime: "15:15",
  },
  {
    customerName: "Emilia Górska",
    dayOffset: 3,
    id: "mock-aug-07-1630",
    serviceIndex: 1,
    staffIndex: 2,
    startTime: "16:30",
  },
  {
    customerName: "Sandra Piątek",
    dayOffset: 3,
    id: "mock-aug-07-1745",
    serviceIndex: 0,
    staffIndex: 0,
    startTime: "17:45",
  },
  {
    customerName: "Renata Urban",
    dayOffset: 3,
    id: "mock-aug-07-1900",
    serviceIndex: 4,
    staffIndex: 3,
    startTime: "19:00",
  },
  {
    customerName: "Milena Czarnecka",
    dayOffset: 3,
    id: "mock-aug-07-2030",
    serviceIndex: 2,
    staffIndex: 4,
    startTime: "20:30",
    status: "pending",
  },
]

const createDenseMockReservations = (today: Date) =>
  denseMockReservationSeeds.map((seed) =>
    createMockReservation({
      customerName: seed.customerName,
      date: addDays(today, seed.dayOffset),
      email: `${seed.id}@example.com`,
      id: seed.id,
      phone: "500600700",
      serviceIndex: seed.serviceIndex,
      staffIndex: seed.staffIndex,
      startTime: seed.startTime,
      status: seed.status,
      today,
    })
  )

const createMockSalonDashboardReservations = (today: Date): StoredBookingReservation[] => {
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  const nextWeek = addDays(today, 6)

  return [
    createMockReservation({
      customerName: "Katarzyna Zielińska",
      date: today,
      email: "katarzyna@example.com",
      id: "mock-today-completed-1",
      phone: "501502503",
      serviceIndex: 0,
      staffIndex: 0,
      startTime: "08:30",
      status: "completed",
      today,
    }),
    createMockReservation({
      customerName: "Oliwia Król",
      date: today,
      email: "oliwia@example.com",
      id: "mock-today-completed-2",
      phone: "512333444",
      serviceIndex: 2,
      staffIndex: 2,
      startTime: "10:30",
      status: "completed",
      today,
    }),
    createMockReservation({
      customerName: "Natalia Kamińska",
      date: today,
      email: "natalia@example.com",
      id: "mock-today-cancelled-1",
      phone: "600123456",
      serviceIndex: 4,
      staffIndex: 3,
      startTime: "12:30",
      status: "cancelled",
      today,
    }),
    createMockReservation({
      customerName: "Magdalena Wójcik",
      date: today,
      email: "magdalena@example.com",
      id: "mock-today-confirmed-1",
      phone: "693120884",
      serviceIndex: 3,
      staffIndex: 4,
      startTime: "15:00",
      today,
    }),
    createMockReservation({
      customerName: "Joanna Kaczmarek",
      date: today,
      email: "joanna@example.com",
      id: "mock-today-confirmed-2",
      phone: "601882014",
      serviceIndex: 1,
      staffIndex: 2,
      startTime: "17:30",
      status: "pending",
      today,
    }),
    createMockReservation({
      customerName: "Piotr Bielecki",
      date: yesterday,
      email: "piotr@example.com",
      id: "mock-yesterday-completed-1",
      phone: "785581863",
      serviceIndex: 0,
      staffIndex: 0,
      startTime: "14:00",
      status: "completed",
      today,
    }),
    createMockReservation({
      customerName: "Weronika Sobczak",
      date: tomorrow,
      email: "weronika@example.com",
      id: "mock-tomorrow-confirmed-1",
      phone: "733222111",
      serviceIndex: 0,
      staffIndex: 1,
      startTime: "09:00",
      today,
    }),
    createMockReservation({
      customerName: "Patrycja Dąbrowska",
      date: nextWeek,
      email: "patrycja@example.com",
      id: "mock-next-week-confirmed-1",
      phone: "577888999",
      serviceIndex: 3,
      staffIndex: 3,
      startTime: "16:00",
      today,
    }),
    ...createDenseMockReservations(today),
  ]
}

export { createMockSalonDashboardReservations }
