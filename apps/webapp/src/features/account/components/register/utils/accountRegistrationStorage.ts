const registrationTokenStorageKey = "beautyBooking.registrationToken";

const getBrowserStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

export const getStoredRegistrationToken = () => {
  return getBrowserStorage()?.getItem(registrationTokenStorageKey) ?? null;
};

export const storeRegistrationToken = (registrationToken: string) => {
  getBrowserStorage()?.setItem(registrationTokenStorageKey, registrationToken);
};

export const clearStoredRegistrationToken = () => {
  getBrowserStorage()?.removeItem(registrationTokenStorageKey);
};
