import type { BusinessSettings, StaffServiceSettings } from "@/features/business-settings/types/businessSettings"
import type { StoredBookingReservation } from "@/features/booking/types/reservation"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

type GenerateAvailableTimeSlotsInput = {
  businessSettings: BusinessSettings
  excludeReservationId?: string
  reservations: StoredBookingReservation[]
  service?: BeautyService
  staffMemberId?: string
}

type StaffServiceDisplayDetails = {
  durationMinutes: number
  priceFrom: number
}

const weekdayFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "long",
})

const dateDisplayFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
})

const timeToMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":")

  return Number(hours) * 60 + Number(minutes)
}

const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

const formatDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const formatDateLabel = (date: Date, today: Date) => {
  const dayDifference = Math.round((startOfDay(date).getTime() - startOfDay(today).getTime()) / 86_400_000)

  if (dayDifference === 0) {
    return "Dzisiaj"
  }

  if (dayDifference === 1) {
    return "Jutro"
  }

  const weekday = weekdayFormatter.format(date)

  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

const addMonths = (date: Date, months: number) => {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + months)

  return nextDate
}

const getServiceSettingsForStaff = (
  businessSettings: BusinessSettings,
  staffMemberId: string,
  serviceId: string
) => {
  const staffSettings = businessSettings.booking.staffMembers.find(
    (staffMember) => staffMember.staffMemberId === staffMemberId
  )

  return staffSettings?.serviceSettings.find((serviceSettings) => serviceSettings.serviceId === serviceId)
}

const getEnabledServiceSettingsForService = (businessSettings: BusinessSettings, serviceId: string) =>
  businessSettings.booking.staffMembers.flatMap((staffMember) => {
    const serviceSettings = staffMember.serviceSettings.find((settings) => settings.serviceId === serviceId)

    return serviceSettings?.isEnabled ? [serviceSettings] : []
  })

const applyStaffServiceSettings = (service: BeautyService, settings: StaffServiceSettings | undefined) => ({
  ...service,
  durationMinutes: settings?.durationMinutes ?? service.durationMinutes,
  priceFrom: settings?.priceFrom ?? service.priceFrom,
})

const getBookableServices = (services: BeautyService[], businessSettings: BusinessSettings) =>
  services.flatMap((service) => {
    const enabledSettings = getEnabledServiceSettingsForService(businessSettings, service.id)

    if (enabledSettings.length === 0) {
      return []
    }

    return [
      {
        ...service,
        durationMinutes: Math.min(...enabledSettings.map((settings) => settings.durationMinutes)),
        priceFrom: Math.min(...enabledSettings.map((settings) => settings.priceFrom)),
      },
    ]
  })

const getBookableStaffMembersForService = (
  staffMembers: BookingStaffMember[],
  businessSettings: BusinessSettings,
  serviceId: string
) =>
  staffMembers
    .filter((staffMember) => getServiceSettingsForStaff(businessSettings, staffMember.id, serviceId)?.isEnabled)
    .map((staffMember) => ({
      ...staffMember,
      serviceIds: staffMember.serviceIds.filter(
        (serviceId) => getServiceSettingsForStaff(businessSettings, staffMember.id, serviceId)?.isEnabled
      ),
    }))

const getStaffServiceDetails = (
  staffMembers: BookingStaffMember[],
  businessSettings: BusinessSettings,
  serviceId: string
) =>
  staffMembers.reduce<Record<string, StaffServiceDisplayDetails>>((details, staffMember) => {
    const serviceSettings = getServiceSettingsForStaff(businessSettings, staffMember.id, serviceId)

    if (!serviceSettings?.isEnabled) {
      return details
    }

    return {
      ...details,
      [staffMember.id]: {
        durationMinutes: serviceSettings.durationMinutes,
        priceFrom: serviceSettings.priceFrom,
      },
    }
  }, {})

const getEffectiveServiceForStaff = (
  service: BeautyService | undefined,
  businessSettings: BusinessSettings,
  staffMemberId: string | undefined
) => {
  if (!service || !staffMemberId) {
    return service
  }

  return applyStaffServiceSettings(service, getServiceSettingsForStaff(businessSettings, staffMemberId, service.id))
}

const overlapsReservation = (
  slotDateValue: string,
  slotStartMinutes: number,
  slotEndMinutes: number,
  staffMemberId: string,
  reservation: StoredBookingReservation,
  defaultStaffMemberId: string
) => {
  if (reservation.status === "cancelled" || reservation.timeSlot.dateValue !== slotDateValue) {
    return false
  }

  const reservationStaffMemberId = reservation.staffMember?.id ?? defaultStaffMemberId

  if (reservationStaffMemberId !== staffMemberId) {
    return false
  }

  const reservationStartMinutes = timeToMinutes(reservation.timeSlot.startTime)
  const reservationEndMinutes = timeToMinutes(reservation.timeSlot.endTime)

  return slotStartMinutes < reservationEndMinutes && slotEndMinutes > reservationStartMinutes
}

const generateAvailableTimeSlots = ({
  businessSettings,
  excludeReservationId,
  reservations,
  service,
  staffMemberId,
}: GenerateAvailableTimeSlotsInput) => {
  // TODO backend: replace this frontend slot generator with the availability API.
  if (!service) {
    return []
  }

  const today = new Date()
  const currentDay = startOfDay(today)
  const lastAvailableDay = startOfDay(addMonths(today, businessSettings.booking.bookingMonthsAhead))
  const staffMemberIds = staffMemberId
    ? [staffMemberId]
    : businessSettings.booking.isSoloBusiness
      ? [businessSettings.booking.defaultStaffMemberId]
      : []
  const blockingReservations = reservations.filter((reservation) => reservation.id !== excludeReservationId)
  const slots: BookingTimeSlot[] = []

  for (let date = currentDay; date <= lastAvailableDay; date = addDays(date, 1)) {
    const dateValue = formatDateValue(date)

    staffMemberIds.forEach((currentStaffMemberId) => {
      const staffSettings = businessSettings.booking.staffMembers.find(
        (staffMember) => staffMember.staffMemberId === currentStaffMemberId
      )
      const serviceSettings = getServiceSettingsForStaff(businessSettings, currentStaffMemberId, service.id)
      const workingDay = staffSettings?.weeklySchedule.find((day) => day.weekday === date.getDay())

      if (!workingDay?.isWorking || !serviceSettings?.isEnabled) {
        return
      }

      const serviceDuration = serviceSettings.durationMinutes
      const workStartMinutes = timeToMinutes(workingDay.startTime)
      const workEndMinutes = timeToMinutes(workingDay.endTime)

      for (
        let startMinutes = workStartMinutes;
        startMinutes + serviceDuration <= workEndMinutes;
        startMinutes += businessSettings.booking.slotStepMinutes
      ) {
        const slotDate = new Date(date)
        slotDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0)

        if (slotDate <= today) {
          continue
        }

        const endMinutes = startMinutes + serviceDuration
        const hasConflict = blockingReservations.some((reservation) =>
          overlapsReservation(
            dateValue,
            startMinutes,
            endMinutes,
            currentStaffMemberId,
            reservation,
            businessSettings.booking.defaultStaffMemberId
          )
        )

        if (hasConflict) {
          continue
        }

        const startTime = minutesToTime(startMinutes)
        const endTime = minutesToTime(endMinutes)

        slots.push({
          dateLabel: formatDateLabel(date, today),
          dateValue,
          endTime,
          id: `${service.id}-${currentStaffMemberId}-${dateValue}-${startTime.replace(":", "")}`,
          serviceId: service.id,
          staffMemberIds: [currentStaffMemberId],
          startTime,
        })
      }
    })
  }

  return slots
}

export {
  dateDisplayFormatter,
  formatDateValue,
  generateAvailableTimeSlots,
  getBookableServices,
  getBookableStaffMembersForService,
  getEffectiveServiceForStaff,
  getStaffServiceDetails,
}
export type { GenerateAvailableTimeSlotsInput, StaffServiceDisplayDetails }
