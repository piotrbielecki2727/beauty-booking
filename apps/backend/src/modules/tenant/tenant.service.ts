import type { Request } from "express";

import type { TenantContextResponse } from "@beauty-booking/shared";

import { env } from "@/config/env";
import {
  findTenantBusinessByHostname,
  findTenantBusinessBySlug,
} from "@/modules/tenant/tenant.repository";
import { ApiError } from "@/utils/apiError";

const developmentFallbackBusinessSlug = "beauty-booking";

const getHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const normalizeTenantHostname = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  try {
    const url = new URL(
      trimmedValue.includes("://") ? trimmedValue : `http://${trimmedValue}`,
    );

    return url.hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return trimmedValue.split(":")[0]?.toLowerCase().replace(/\.$/, "") ?? "";
  }
};

const isLocalBackendHostname = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const getTenantHostFromRequest = (request: Request) =>
  getHeaderValue(request.headers["x-tenant-host"]) ??
  getHeaderValue(request.headers.origin) ??
  getHeaderValue(request.headers.host);

const getDevelopmentFallbackTenantContext =
  async (): Promise<TenantContextResponse> => {
    const business = await findTenantBusinessBySlug(
      developmentFallbackBusinessSlug,
    );

    if (!business) {
      throw new ApiError(500, "Brak domyślnego biznesu developerskiego.");
    }

    return {
      business,
    };
  };

const resolveTenantContextByHost = async (
  host: string | undefined,
): Promise<TenantContextResponse> => {
  if (!host) {
    if (env.NODE_ENV !== "production") {
      return getDevelopmentFallbackTenantContext();
    }

    throw new ApiError(400, "Brak kontekstu biznesu.");
  }

  const hostname = normalizeTenantHostname(host);

  if (!hostname) {
    throw new ApiError(400, "Nieprawidłowy kontekst biznesu.");
  }

  const businessDomain = await findTenantBusinessByHostname(hostname);

  if (businessDomain) {
    return {
      business: businessDomain.business,
    };
  }

  if (env.NODE_ENV !== "production" && isLocalBackendHostname(hostname)) {
    return getDevelopmentFallbackTenantContext();
  }

  throw new ApiError(404, "Nie znaleziono biznesu dla tej domeny.");
};

const resolveTenantContextFromRequest = (request: Request) =>
  resolveTenantContextByHost(getTenantHostFromRequest(request));

export {
  normalizeTenantHostname,
  resolveTenantContextByHost,
  resolveTenantContextFromRequest,
};
