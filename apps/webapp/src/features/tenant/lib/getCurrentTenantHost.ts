export const getCurrentTenantHost = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.host;
};
