import { z } from "zod";

import {
  authRegistrationFlowResponseSchema,
  authMeResponseSchema,
  authResponseSchema,
  authVerifyEmailResponseSchema,
  type AccountLoginValues,
  type AccountRegistrationValues,
  type AuthMeResponse,
  type AuthRegistrationFlowResponse,
  type AuthRegistrationTokenRequest,
  type AuthResponse,
  type AuthVerifyEmailRequest,
} from "@beauty-booking/shared";

import { backendApiUrl } from "@/config";
import { getCurrentTenantHost } from "@/features/tenant/lib/getCurrentTenantHost";

type AccountAuthApiErrorCode =
  | "connectionError"
  | "invalidResponse"
  | "requestFailed";

type AccountAuthApiErrorPayload = {
  message?: string;
};

type AccountAuthRequestOptions<ResponseSchema extends z.ZodType> = {
  body: unknown;
  path: string;
  schema: ResponseSchema;
  tenantHost?: string;
};

export type AuthRegisterResponse = AuthRegistrationFlowResponse;

export class AccountAuthApiError extends Error {
  code: AccountAuthApiErrorCode;
  status?: number;

  constructor({
    code,
    message,
    status,
  }: {
    code: AccountAuthApiErrorCode;
    message?: string;
    status?: number;
  }) {
    super(message ?? code);
    this.name = "AccountAuthApiError";
    this.code = code;
    this.status = status;
  }
}

const getResponseErrorMessage = (payload: unknown) => {
  const errorPayload = payload as AccountAuthApiErrorPayload | undefined;

  return errorPayload?.message;
};

const parseJsonResponse = async <ResponseSchema extends z.ZodType>(
  response: Response,
  schema: ResponseSchema,
) => {
  const payload = (await response.json().catch(() => undefined)) as unknown;

  if (!response.ok) {
    throw new AccountAuthApiError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      status: response.status,
    });
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new AccountAuthApiError({
      code: "invalidResponse",
    });
  }

  return parsedPayload.data;
};

const requestAccountAuth = async <ResponseSchema extends z.ZodType>({
  body,
  path,
  schema,
  tenantHost = getCurrentTenantHost(),
}: AccountAuthRequestOptions<ResponseSchema>) => {
  let response: Response;
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (tenantHost) {
    headers.set("X-Tenant-Host", tenantHost);
  }

  try {
    response = await fetch(`${backendApiUrl}${path}`, {
      body: JSON.stringify(body),
      cache: "no-store",
      headers,
      method: "POST",
    });
  } catch {
    throw new AccountAuthApiError({
      code: "connectionError",
    });
  }

  return parseJsonResponse(response, schema);
};

const requestAccountAuthAction = async (path: string, body: unknown) => {
  let response: Response;

  try {
    response = await fetch(`${backendApiUrl}${path}`, {
      body: JSON.stringify(body),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new AccountAuthApiError({
      code: "connectionError",
    });
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as unknown;

    throw new AccountAuthApiError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      status: response.status,
    });
  }
};

export const registerAccount = (values: AccountRegistrationValues) => {
  return requestAccountAuth({
    body: values,
    path: "/auth/register",
    schema: authRegistrationFlowResponseSchema,
  });
};

export const resumeAccountRegistration = (
  values: AuthRegistrationTokenRequest,
) => {
  return requestAccountAuth({
    body: values,
    path: "/auth/register/resume",
    schema: authRegistrationFlowResponseSchema,
  });
};

export const resendAccountRegistrationCode = (
  values: AuthRegistrationTokenRequest,
) => {
  return requestAccountAuth({
    body: values,
    path: "/auth/register/resend-code",
    schema: authRegistrationFlowResponseSchema,
  });
};

export const cancelAccountRegistration = (
  values: AuthRegistrationTokenRequest,
) => {
  return requestAccountAuthAction("/auth/register/cancel", values);
};

export const verifyAccountEmail = (values: AuthVerifyEmailRequest) => {
  return requestAccountAuth({
    body: values,
    path: "/auth/verify-email",
    schema: authVerifyEmailResponseSchema,
  });
};

export const loginAccount = (
  values: AccountLoginValues,
  options?: {
    tenantHost?: string;
  },
): Promise<AuthResponse> => {
  return requestAccountAuth({
    body: values,
    path: "/auth/login",
    schema: authResponseSchema,
    tenantHost: options?.tenantHost,
  });
};

export const getCurrentAccount = async (
  accessToken: string,
): Promise<AuthMeResponse> => {
  let response: Response;

  try {
    response = await fetch(`${backendApiUrl}/auth/me`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });
  } catch {
    throw new AccountAuthApiError({
      code: "connectionError",
    });
  }

  return parseJsonResponse(response, authMeResponseSchema);
};

export const logoutAccount = async (accessToken: string) => {
  let response: Response;

  try {
    response = await fetch(`${backendApiUrl}/auth/logout`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
    });
  } catch {
    throw new AccountAuthApiError({
      code: "connectionError",
    });
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as unknown;

    throw new AccountAuthApiError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      status: response.status,
    });
  }
};

export type { AccountAuthApiErrorCode };
