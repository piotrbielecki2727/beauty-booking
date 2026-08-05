import type { BusinessSettings, StaffServiceSettings, WorkingDaySettings } from "@/features/business-settings/types/businessSettings"
import { mockBeautyServices } from "@/features/booking/mocks/services"

const defaultBusinessWorkingStart = "06:00"
const defaultBusinessWorkingEnd = "22:00"

const createDefaultWeeklySchedule = (startTime = defaultBusinessWorkingStart, endTime = defaultBusinessWorkingEnd) =>
  [
    { endTime, isWorking: false, startTime, weekday: 0 },
    { endTime, isWorking: true, startTime, weekday: 1 },
    { endTime, isWorking: true, startTime, weekday: 2 },
    { endTime, isWorking: true, startTime, weekday: 3 },
    { endTime, isWorking: true, startTime, weekday: 4 },
    { endTime, isWorking: true, startTime, weekday: 5 },
    { endTime: "18:00", isWorking: true, startTime: "08:00", weekday: 6 },
  ] satisfies WorkingDaySettings[]

const createServiceSettings = (multiplier = 1, durationOffsetMinutes = 0): StaffServiceSettings[] =>
  mockBeautyServices.map((service) => ({
    durationMinutes: Math.max(30, service.durationMinutes + durationOffsetMinutes),
    isEnabled: true,
    priceFrom: Math.round((service.priceFrom * multiplier) / 5) * 5,
    serviceId: service.id,
  }))

const defaultBusinessSettings = {
  booking: {
    bookingMonthsAhead: 3,
    defaultStaffMemberId: "staff-owner",
    isSoloBusiness: true,
    slotStepMinutes: 30,
    staffMembers: [
      {
        isOwner: true,
        serviceSettings: createServiceSettings(1),
        staffMemberId: "staff-owner",
        weeklySchedule: createDefaultWeeklySchedule(),
      },
      {
        isOwner: false,
        serviceSettings: createServiceSettings(0.95, 15).map((settings) => ({
          ...settings,
          isEnabled: ["manicure-hybrid", "lashes-light-volume", "brow-styling"].includes(settings.serviceId),
        })),
        staffMemberId: "staff-amelia",
        weeklySchedule: createDefaultWeeklySchedule("08:00", "18:00"),
      },
      {
        isOwner: false,
        serviceSettings: createServiceSettings(1.05).map((settings) => ({
          ...settings,
          isEnabled: ["lashes-light-volume", "brow-styling"].includes(settings.serviceId),
        })),
        staffMemberId: "staff-julia",
        weeklySchedule: createDefaultWeeklySchedule("10:00", "19:00"),
      },
      {
        isOwner: false,
        serviceSettings: createServiceSettings(1.1, -15).map((settings) => ({
          ...settings,
          isEnabled: ["occasion-makeup", "soft-waves"].includes(settings.serviceId),
        })),
        staffMemberId: "staff-lena",
        weeklySchedule: createDefaultWeeklySchedule("12:00", "22:00"),
      },
      {
        isOwner: false,
        serviceSettings: createServiceSettings(1).map((settings) => ({
          ...settings,
          isEnabled: ["brow-styling", "occasion-makeup", "soft-waves"].includes(settings.serviceId),
        })),
        staffMemberId: "staff-marta",
        weeklySchedule: createDefaultWeeklySchedule("09:00", "17:00"),
      },
    ],
  },
  businessId: "business_001",
  businessName: "Atelier Beauty",
} satisfies BusinessSettings

export { createDefaultWeeklySchedule, defaultBusinessSettings }
