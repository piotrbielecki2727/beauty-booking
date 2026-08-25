import { env } from "@/config/env";

const isDevelopmentLocalOrigin = (origin: string) => {
  if (env.NODE_ENV === "production") {
    return false;
  }

  try {
    const { hostname } = new URL(origin);

    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
};

const isAllowedCorsOrigin = (origin: string | undefined) => {
  if (!origin) {
    return true;
  }

  return origin === env.WEB_ORIGIN || isDevelopmentLocalOrigin(origin);
};

export { isAllowedCorsOrigin };
