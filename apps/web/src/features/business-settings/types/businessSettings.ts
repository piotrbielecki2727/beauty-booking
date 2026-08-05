import type { AccountRole } from "@/features/account/types/accountRole"

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

type WorkingDaySettings = {
  endTime: string
  isWorking: boolean
  startTime: string
  weekday: Weekday
}

type StaffServiceSettings = {
  durationMinutes: number
  isEnabled: boolean
  priceFrom: number
  serviceId: string
}

type StaffMemberAvailabilitySettings = {
  isOwner: boolean
  serviceSettings: StaffServiceSettings[]
  staffMemberId: string
  weeklySchedule: WorkingDaySettings[]
}

type BusinessBookingSettings = {
  bookingMonthsAhead: number
  defaultStaffMemberId: string
  isSoloBusiness: boolean
  slotStepMinutes: number
  staffMembers: StaffMemberAvailabilitySettings[]
}

type BusinessSettings = {
  booking: BusinessBookingSettings
  businessId: string
  businessName: string
}

type BusinessSettingsPermission = {
  canEditAvailability: boolean
}

const privilegedBusinessSettingsRoles = ["Admin", "Owner"] satisfies AccountRole[]

export { privilegedBusinessSettingsRoles }
export type {
  BusinessBookingSettings,
  BusinessSettings,
  BusinessSettingsPermission,
  StaffMemberAvailabilitySettings,
  StaffServiceSettings,
  Weekday,
  WorkingDaySettings,
}
