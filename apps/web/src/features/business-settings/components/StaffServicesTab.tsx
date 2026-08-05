import { AppDropdown } from "@/components/common/app-dropdown"
import { FormField } from "@/components/common/form-field"
import { SectionCard } from "@/components/common/section-card"
import { SaveAction } from "@/features/business-settings/components/SaveAction"
import { ServiceSettingsEditor } from "@/features/business-settings/components/ServiceSettingsEditor"
import { WeeklyScheduleEditor } from "@/features/business-settings/components/WeeklyScheduleEditor"
import type { StaffMemberAvailabilitySettings } from "@/features/business-settings/types/businessSettings"
import type { StaffSettingsChangeHandler } from "@/features/business-settings/types/salonManagement"
import { getStaffDisplayName } from "@/features/business-settings/utils/businessSettingsDrafts"
import type { BookingStaffMember } from "@/features/booking/types/staff"

type StaffServicesTabProps = {
  isDirty: boolean
  isSoloBusiness: boolean
  onSave: () => void
  onSelectedStaffMemberChange: (staffMemberId: string) => void
  onStaffSettingsChange: StaffSettingsChangeHandler
  savedMessage: string | null
  selectedStaffMemberId: string
  soloStaffMemberId: string
  staffMembers: StaffMemberAvailabilitySettings[]
  staffNameById: ReadonlyMap<string, BookingStaffMember>
}

const StaffServicesTab = ({
  isDirty,
  isSoloBusiness,
  onSave,
  onSelectedStaffMemberChange,
  onStaffSettingsChange,
  savedMessage,
  selectedStaffMemberId,
  soloStaffMemberId,
  staffMembers,
  staffNameById,
}: StaffServicesTabProps) => {
  const selectedId = isSoloBusiness ? soloStaffMemberId : selectedStaffMemberId
  const selectedStaffSettings =
    staffMembers.find((staffSettings) => staffSettings.staffMemberId === selectedId) ??
    staffMembers.find((staffSettings) => staffSettings.isOwner) ??
    staffMembers[0]
  const selectedStaffMember = selectedStaffSettings
    ? staffNameById.get(selectedStaffSettings.staffMemberId)
    : undefined
  const staffOptions = staffMembers.map((staffSettings) => {
    const staffMember = staffNameById.get(staffSettings.staffMemberId)

    return {
      description: staffSettings.isOwner ? "Właściciel" : staffMember?.role,
      label: getStaffDisplayName(staffNameById, staffSettings),
      value: staffSettings.staffMemberId,
    }
  })

  if (!selectedStaffSettings) {
    return (
      <SectionCard title="Wykonawcy, grafiki i usługi">
        <p className="text-sm leading-6 text-muted-foreground">
          Brak wykonawców do skonfigurowania.
        </p>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      action={
        <SaveAction
          isDirty={isDirty}
          onSave={onSave}
          savedMessage={savedMessage}
        />
      }
      description={
        isSoloBusiness
          ? "Ustaw grafik, usługi, czas wykonania i cenę."
          : "Wybierz wykonawcę, a następnie ustaw jego grafik, zakres usług, czas wykonania i cenę."
      }
      title="Wykonawcy, grafiki i usługi"
    >
      <div className="grid gap-5">
        {!isSoloBusiness ? (
          <div className="grid gap-4 rounded-lg border border-border/70 bg-muted/20 p-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end">
            <FormField label="Wykonawca">
              <AppDropdown
                onValueChange={onSelectedStaffMemberChange}
                options={staffOptions}
                value={selectedStaffSettings.staffMemberId}
              />
            </FormField>

            <div className="grid gap-1 text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">
                {selectedStaffMember?.name ?? selectedStaffSettings.staffMemberId}
              </p>
              <p>
                {selectedStaffSettings.isOwner
                  ? "Właściciel"
                  : selectedStaffMember?.role ?? "Pracownik"}{" "}
                ma własny grafik, listę usług oraz indywidualne ceny widoczne w rezerwacji online.
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <WeeklyScheduleEditor
            onStaffSettingsChange={onStaffSettingsChange}
            staffSettings={selectedStaffSettings}
          />
          <ServiceSettingsEditor
            onStaffSettingsChange={onStaffSettingsChange}
            staffSettings={selectedStaffSettings}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export { StaffServicesTab }
export type { StaffServicesTabProps }
