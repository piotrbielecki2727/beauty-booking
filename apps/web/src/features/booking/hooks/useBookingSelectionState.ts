import type { BusinessSettings } from "@/features/business-settings/types/businessSettings";
import { mockBeautyServices } from "@/features/booking/mocks/services";
import { mockStaffMembers } from "@/features/booking/mocks/staff";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import {
  generateAvailableTimeSlots,
  getBookableServices,
  getBookableStaffMembersForService,
  getEffectiveServiceForStaff,
  getStaffServiceDetails,
} from "@/features/booking/utils/availability";
import { getEditedTimeSlotFallback } from "@/features/booking/utils/bookingFlowState";

type UseBookingSelectionStateOptions = {
  businessSettings: BusinessSettings;
  editingReservationId?: string;
  initialEditedReservation?: StoredBookingReservation;
  isSoloBusiness: boolean;
  reservations: StoredBookingReservation[];
  selectedServiceId?: string;
  selectedStaffMemberId?: string;
  selectedTimeSlotId?: string;
};

const useBookingSelectionState = ({
  businessSettings,
  editingReservationId,
  initialEditedReservation,
  isSoloBusiness,
  reservations,
  selectedServiceId,
  selectedStaffMemberId,
  selectedTimeSlotId,
}: UseBookingSelectionStateOptions) => {
  // TODO backend: replace mock services/staff and local slot generation with API queries.
  const services = getBookableServices(mockBeautyServices, businessSettings);
  const selectedBaseService = services.find(
    (service) => service.id === selectedServiceId,
  );
  const effectiveStaffMemberId = isSoloBusiness
    ? businessSettings.booking.defaultStaffMemberId
    : selectedStaffMemberId;
  const selectedService = getEffectiveServiceForStaff(
    selectedBaseService,
    businessSettings,
    effectiveStaffMemberId,
  );
  const availableStaffMembers = selectedBaseService
    ? getBookableStaffMembersForService(
        mockStaffMembers,
        businessSettings,
        selectedBaseService.id,
      )
    : [];
  const selectedStaffMember = isSoloBusiness
    ? undefined
    : availableStaffMembers.find(
        (staffMember) => staffMember.id === selectedStaffMemberId,
      );
  const staffServiceDetails = selectedBaseService
    ? getStaffServiceDetails(
        availableStaffMembers,
        businessSettings,
        selectedBaseService.id,
      )
    : {};
  const availableTimeSlots = generateAvailableTimeSlots({
    businessSettings,
    excludeReservationId: editingReservationId,
    reservations,
    service: selectedBaseService,
    staffMemberId: effectiveStaffMemberId,
  });
  const editedTimeSlot = getEditedTimeSlotFallback(initialEditedReservation);
  const selectedTimeSlot =
    availableTimeSlots.find((slot) => slot.id === selectedTimeSlotId) ??
    (editedTimeSlot?.id === selectedTimeSlotId ? editedTimeSlot : undefined);

  return {
    availableStaffMembers,
    availableTimeSlots,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
    services,
    staffServiceDetails,
  };
};

export { useBookingSelectionState };
export type { UseBookingSelectionStateOptions };
