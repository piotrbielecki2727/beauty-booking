import type {
  BusinessOnboardingStatus,
  BusinessType,
} from "@beauty-booking/shared";

const BUSINESS_SETUP_STATUS_CHANGED_EVENT =
  "beauty-booking:business-setup-status-changed";

type BusinessSetupStatusChange = {
  businessType: BusinessType | null;
  status: BusinessOnboardingStatus;
};

export const notifyBusinessSetupStatusChanged = (
  change: BusinessSetupStatusChange,
) => {
  window.dispatchEvent(
    new CustomEvent<BusinessSetupStatusChange>(
      BUSINESS_SETUP_STATUS_CHANGED_EVENT,
      { detail: change },
    ),
  );
};

export const subscribeToBusinessSetupStatus = (
  onStatusChange: (change: BusinessSetupStatusChange) => void,
) => {
  const handleStatusChange = (event: Event) => {
    onStatusChange(
      (event as CustomEvent<BusinessSetupStatusChange>).detail,
    );
  };

  window.addEventListener(
    BUSINESS_SETUP_STATUS_CHANGED_EVENT,
    handleStatusChange,
  );

  return () =>
    window.removeEventListener(
      BUSINESS_SETUP_STATUS_CHANGED_EVENT,
      handleStatusChange,
    );
};
