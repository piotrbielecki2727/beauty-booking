import type { BookingStaffMember } from "@/features/booking/types/staff"
import type {
  BusinessBookingSettings,
  BusinessSettings,
  StaffMemberAvailabilitySettings,
  WorkingDaySettings,
} from "@/features/business-settings/types/businessSettings"
import type { OnlineBookingDraft } from "@/features/business-settings/types/salonManagement"

const getOnlineBookingDraft = (
  booking: BusinessBookingSettings
): OnlineBookingDraft => ({
  bookingMonthsAhead: booking.bookingMonthsAhead,
  defaultStaffMemberId: booking.defaultStaffMemberId,
  isSoloBusiness: booking.isSoloBusiness,
  slotStepMinutes: booking.slotStepMinutes,
})

const cloneWorkingSchedule = (weeklySchedule: WorkingDaySettings[]) =>
  weeklySchedule.map((day) => ({
    ...day,
  }))

const cloneStaffSettings = (
  staffSettings: StaffMemberAvailabilitySettings
) => ({
  ...staffSettings,
  serviceSettings: staffSettings.serviceSettings.map((serviceSettings) => ({
    ...serviceSettings,
  })),
  weeklySchedule: cloneWorkingSchedule(staffSettings.weeklySchedule),
})

const cloneStaffMembersSettings = (
  staffMembers: StaffMemberAvailabilitySettings[]
) => staffMembers.map((staffSettings) => cloneStaffSettings(staffSettings))

const areDraftsEqual = (firstValue: unknown, secondValue: unknown) =>
  JSON.stringify(firstValue) === JSON.stringify(secondValue)

const getOwnerStaffMemberId = (
  staffMembers: StaffMemberAvailabilitySettings[]
) =>
  staffMembers.find((staffSettings) => staffSettings.isOwner)?.staffMemberId ??
  staffMembers[0]?.staffMemberId ??
  ""

const getStaffDisplayName = (
  staffNameById: ReadonlyMap<string, BookingStaffMember>,
  staffSettings: StaffMemberAvailabilitySettings
) => staffNameById.get(staffSettings.staffMemberId)?.name ?? staffSettings.staffMemberId

const createSavedSettings = ({
  onlineDraft,
  settings,
  staffDrafts,
}: {
  onlineDraft: OnlineBookingDraft
  settings: BusinessSettings
  staffDrafts: StaffMemberAvailabilitySettings[]
}) => ({
  ...settings,
  booking: {
    ...settings.booking,
    ...onlineDraft,
    staffMembers: cloneStaffMembersSettings(staffDrafts),
  },
})

export {
  areDraftsEqual,
  cloneStaffMembersSettings,
  createSavedSettings,
  getOnlineBookingDraft,
  getOwnerStaffMemberId,
  getStaffDisplayName,
}
