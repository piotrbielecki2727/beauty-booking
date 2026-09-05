const blockedAuthRedirectPrefixes = ["/login", "/register"];

export const getSafeAuthRedirect = (value: string | string[] | undefined) => {
  if (typeof value !== "string") {
    return undefined;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  if (
    blockedAuthRedirectPrefixes.some(
      (prefix) => value === prefix || value.startsWith(`${prefix}/`),
    )
  ) {
    return undefined;
  }

  return value;
};

export const getAuthRedirectQuery = (redirectTo: string | undefined) =>
  redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : "";
