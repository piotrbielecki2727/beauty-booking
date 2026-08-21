import { z } from "zod";

import {
  businessSetupResponseSchema,
  type BusinessBasicsForm,
  type BusinessLocationForm,
  type BusinessServicesForm,
  type BusinessSetupResponse,
  type BusinessTeamForm,
  type BusinessWorkstationsForm,
} from "@beauty-booking/shared";

import { backendApiUrl } from "@/config";

type BusinessSetupApiErrorCode =
  | "connectionError"
  | "invalidResponse"
  | "requestFailed"
  | "timeout";

type BusinessSetupApiErrorPayload = {
  message?: string;
};

type BusinessSetupRequestOptions<ResponseSchema extends z.ZodType> = {
  accessToken: string;
  body?: unknown;
  method: "GET" | "PATCH";
  path: string;
  schema: ResponseSchema;
};

type PendingBusinessSetupRequest = {
  accessToken: string;
  request: Promise<BusinessSetupResponse>;
};

let pendingBusinessSetupRequest: PendingBusinessSetupRequest | undefined;
const businessSetupRequestTimeoutMs = 30_000;

export class BusinessSetupApiError extends Error {
  code: BusinessSetupApiErrorCode;
  status?: number;

  constructor({
    code,
    message,
    status,
  }: {
    code: BusinessSetupApiErrorCode;
    message?: string;
    status?: number;
  }) {
    super(message ?? code);
    this.name = "BusinessSetupApiError";
    this.code = code;
    this.status = status;
  }
}

const getResponseErrorMessage = (payload: unknown) => {
  const errorPayload = payload as BusinessSetupApiErrorPayload | undefined;

  return errorPayload?.message;
};

const parseJsonResponse = async <ResponseSchema extends z.ZodType>(
  response: Response,
  schema: ResponseSchema,
) => {
  const payload = (await response.json().catch(() => undefined)) as unknown;

  if (!response.ok) {
    throw new BusinessSetupApiError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      status: response.status,
    });
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new BusinessSetupApiError({
      code: "invalidResponse",
    });
  }

  return parsedPayload.data;
};

const requestBusinessSetup = async <ResponseSchema extends z.ZodType>({
  accessToken,
  body,
  method,
  path,
  schema,
}: BusinessSetupRequestOptions<ResponseSchema>) => {
  let response: Response;
  const abortController = new AbortController();
  const timeoutId = setTimeout(
    () => abortController.abort(),
    businessSetupRequestTimeoutMs,
  );
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
  });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    response = await fetch(`${backendApiUrl}${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers,
      method,
      signal: abortController.signal,
    });
  } catch (error: unknown) {
    throw new BusinessSetupApiError({
      code:
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "connectionError",
    });
  } finally {
    clearTimeout(timeoutId);
  }

  return parseJsonResponse(response, schema);
};

export const getBusinessSetup = (
  accessToken: string,
): Promise<BusinessSetupResponse> => {
  if (pendingBusinessSetupRequest?.accessToken === accessToken) {
    return pendingBusinessSetupRequest.request;
  }

  const request = requestBusinessSetup({
    accessToken,
    method: "GET",
    path: "/business/setup",
    schema: businessSetupResponseSchema,
  });

  pendingBusinessSetupRequest = {
    accessToken,
    request,
  };

  const clearPendingRequest = () => {
    if (pendingBusinessSetupRequest?.request === request) {
      pendingBusinessSetupRequest = undefined;
    }
  };

  void request.then(clearPendingRequest, clearPendingRequest);

  return request;
};

export const saveBusinessBasics = ({
  accessToken,
  values,
}: {
  accessToken: string;
  values: BusinessBasicsForm;
}): Promise<BusinessSetupResponse> =>
  requestBusinessSetup({
    accessToken,
    body: values,
    method: "PATCH",
    path: "/business/setup/business-basics",
    schema: businessSetupResponseSchema,
  });

export const saveBusinessLocation = ({
  accessToken,
  values,
}: {
  accessToken: string;
  values: BusinessLocationForm;
}): Promise<BusinessSetupResponse> =>
  requestBusinessSetup({
    accessToken,
    body: values,
    method: "PATCH",
    path: "/business/setup/location",
    schema: businessSetupResponseSchema,
  });

export const saveBusinessWorkstations = ({
  accessToken,
  values,
}: {
  accessToken: string;
  values: BusinessWorkstationsForm;
}): Promise<BusinessSetupResponse> =>
  requestBusinessSetup({
    accessToken,
    body: values,
    method: "PATCH",
    path: "/business/setup/workstations",
    schema: businessSetupResponseSchema,
  });

export const saveBusinessServices = ({
  accessToken,
  values,
}: {
  accessToken: string;
  values: BusinessServicesForm;
}): Promise<BusinessSetupResponse> =>
  requestBusinessSetup({
    accessToken,
    body: values,
    method: "PATCH",
    path: "/business/setup/services",
    schema: businessSetupResponseSchema,
  });

export const saveBusinessTeam = ({
  accessToken,
  values,
}: {
  accessToken: string;
  values: BusinessTeamForm;
}): Promise<BusinessSetupResponse> =>
  requestBusinessSetup({
    accessToken,
    body: values,
    method: "PATCH",
    path: "/business/setup/team",
    schema: businessSetupResponseSchema,
  });

export type { BusinessSetupApiErrorCode };
