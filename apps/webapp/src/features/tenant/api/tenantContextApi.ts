import { z } from "zod";

import {
  tenantContextResponseSchema,
  type TenantContextResponse,
} from "@beauty-booking/shared";

import { backendApiUrl } from "@/config";
import { getCurrentTenantHost } from "@/features/tenant/lib/getCurrentTenantHost";

type TenantContextApiErrorCode =
  | "connectionError"
  | "invalidResponse"
  | "requestFailed";

type TenantContextApiErrorPayload = {
  message?: string;
};

export class TenantContextApiError extends Error {
  code: TenantContextApiErrorCode;
  status?: number;

  constructor({
    code,
    message,
    status,
  }: {
    code: TenantContextApiErrorCode;
    message?: string;
    status?: number;
  }) {
    super(message ?? code);
    this.name = "TenantContextApiError";
    this.code = code;
    this.status = status;
  }
}

const getResponseErrorMessage = (payload: unknown) => {
  const errorPayload = payload as TenantContextApiErrorPayload | undefined;

  return errorPayload?.message;
};

const parseJsonResponse = async <ResponseSchema extends z.ZodType>(
  response: Response,
  schema: ResponseSchema,
) => {
  const payload = (await response.json().catch(() => undefined)) as unknown;

  if (!response.ok) {
    throw new TenantContextApiError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      status: response.status,
    });
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new TenantContextApiError({
      code: "invalidResponse",
    });
  }

  return parsedPayload.data;
};

export const getTenantContext = async ({
  signal,
  tenantHost = getCurrentTenantHost(),
}: {
  signal?: AbortSignal;
  tenantHost?: string;
} = {}): Promise<TenantContextResponse> => {
  const headers = new Headers();

  if (tenantHost) {
    headers.set("X-Tenant-Host", tenantHost);
  }

  let response: Response;

  try {
    response = await fetch(`${backendApiUrl}/tenant/context`, {
      cache: "no-store",
      headers,
      method: "GET",
      signal,
    });
  } catch {
    throw new TenantContextApiError({
      code: "connectionError",
    });
  }

  return parseJsonResponse(response, tenantContextResponseSchema);
};

export type { TenantContextApiErrorCode };
