import { AppDropdown } from "@/components/common/app-dropdown"
import { FormField } from "@/components/common/form-field"
import { SectionCard } from "@/components/common/section-card"
import { SaveAction } from "@/features/business-settings/components/SaveAction"
import {
  bookingMonthsAheadOptions,
  slotStepOptions,
} from "@/features/business-settings/config/salonManagementOptions"
import type { StaffMemberAvailabilitySettings } from "@/features/business-settings/types/businessSettings"
import type { OnlineBookingDraft } from "@/features/business-settings/types/salonManagement"
import {
  getOwnerStaffMemberId,
  getStaffDisplayName,
} from "@/features/business-settings/utils/businessSettingsDrafts"
import type { BookingStaffMember } from "@/features/booking/types/staff"

type OnlineBookingTabProps = {
  draft: OnlineBookingDraft
  isDirty: boolean
  onChange: (changes: Partial<OnlineBookingDraft>) => void
  onSave: () => void
  savedMessage: string | null
  staffMembers: StaffMemberAvailabilitySettings[]
  staffNameById: ReadonlyMap<string, BookingStaffMember>
}

const OnlineBookingTab = ({
  draft,
  isDirty,
  onChange,
  onSave,
  savedMessage,
  staffMembers,
  staffNameById,
}: OnlineBookingTabProps) => {
  const ownerStaffMemberId = getOwnerStaffMemberId(staffMembers)
  const staffOptions = staffMembers.map((staffSettings) => {
    const staffMember = staffNameById.get(staffSettings.staffMemberId)

    return {
      description: staffSettings.isOwner ? "Właściciel" : staffMember?.role,
      label: getStaffDisplayName(staffNameById, staffSettings),
      value: staffSettings.staffMemberId,
    }
  })

  return (
    <SectionCard
      action={
        <SaveAction
          isDirty={isDirty}
          onSave={onSave}
          savedMessage={savedMessage}
        />
      }
      description="Ustaw zasady widoczności terminów i podstawowy tryb działania rezerwacji online."
      title="Rezerwacje online"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Tryb działalności">
          <AppDropdown
            onValueChange={(value) =>
              onChange({
                defaultStaffMemberId:
                  value === "solo"
                    ? ownerStaffMemberId
                    : draft.defaultStaffMemberId,
                isSoloBusiness: value === "solo",
              })
            }
            options={[
              {
                description:
                  "Klientka wybiera usługę i termin bez wyboru pracownika.",
                label: "Działalność jednoosobowa",
                value: "solo",
              },
              {
                description:
                  "Rezerwacja może uwzględniać dostępność wielu wykonawców.",
                label: "Zespół",
                value: "team",
              },
            ]}
            value={draft.isSoloBusiness ? "solo" : "team"}
          />
        </FormField>

        {!draft.isSoloBusiness ? (
          <FormField label="Domyślny wykonawca">
            <AppDropdown
              onValueChange={(value) =>
                onChange({ defaultStaffMemberId: value })
              }
              options={staffOptions}
              value={draft.defaultStaffMemberId}
            />
          </FormField>
        ) : null}

        <FormField label="Rezerwacje do przodu">
          <AppDropdown
            onValueChange={(value) =>
              onChange({ bookingMonthsAhead: Number(value) })
            }
            options={bookingMonthsAheadOptions.map((monthsAhead) => ({
              label: `${monthsAhead} mies.`,
              value: String(monthsAhead),
            }))}
            value={String(draft.bookingMonthsAhead)}
          />
        </FormField>

        <FormField label="Krok terminów">
          <AppDropdown
            onValueChange={(value) =>
              onChange({ slotStepMinutes: Number(value) })
            }
            options={slotStepOptions.map((stepMinutes) => ({
              label: `co ${stepMinutes} min`,
              value: String(stepMinutes),
            }))}
            value={String(draft.slotStepMinutes)}
          />
        </FormField>
      </div>
    </SectionCard>
  )
}

export { OnlineBookingTab }
export type { OnlineBookingTabProps }
