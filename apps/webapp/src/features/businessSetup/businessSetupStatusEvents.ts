import type { BusinessOnboardingStatus } from "@beauty-booking/shared";

const BUSINESS_SETUP_STATUS_CHANGED_EVENT =
  "beauty-booking:business-setup-status-changed";

export const notifyBusinessSetupStatusChanged = (
  status: BusinessOnboardingStatus,
) => {
  window.dispatchEvent(
    new CustomEvent<BusinessOnboardingStatus>(
      BUSINESS_SETUP_STATUS_CHANGED_EVENT,
      { detail: status },
    ),
  );
};

export const subscribeToBusinessSetupStatus = (
  onStatusChange: (status: BusinessOnboardingStatus) => void,
) => {
  const handleStatusChange = (event: Event) => {
    onStatusChange(
      (event as CustomEvent<BusinessOnboardingStatus>).detail,
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
