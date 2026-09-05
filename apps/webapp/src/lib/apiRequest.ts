import { z } from "zod";

import { backendApiUrl } from "@/config";

type ApiRequestErrorCode =
  | "cancelled"
  | "connectionError"
  | "invalidResponse"
  | "requestFailed"
  | "timeout";

type ApiRequestOptions<ResponseSchema extends z.ZodType> = {
  accessToken?: string;
  baseUrl?: string;
  body?: unknown;
  errorName?: string;
  headers?: HeadersInit;
  method: "DELETE" | "GET" | "PATCH" | "POST";
  path: string;
  schema: ResponseSchema;
  signal?: AbortSignal;
  timeoutMs?: number;
};

type ApiRequestErrorPayload = {
  message?: string;
};

type ApiRequestAbortReason = "cancelled" | "timeout";

const defaultApiRequestTimeoutMs = 30_000;

class ApiRequestError extends Error {
  code: ApiRequestErrorCode;
  status?: number;

  constructor({
    code,
    message,
    name = "ApiRequestError",
    status,
  }: {
    code: ApiRequestErrorCode;
    message?: string;
    name?: string;
    status?: number;
  }) {
    super(message ?? code);
    this.name = name;
    this.code = code;
    this.status = status;
  }
}

const getResponseErrorMessage = (payload: unknown) => {
  const errorPayload = payload as ApiRequestErrorPayload | undefined;

  return errorPayload?.message;
};

const createAbortError = ({
  errorName,
  reason,
}: {
  errorName: string;
  reason: ApiRequestAbortReason;
}) =>
  new ApiRequestError({
    code: reason,
    message: reason === "timeout" ? "Request timed out" : "Request cancelled",
    name: errorName,
  });

const createComposedSignal = ({
  signal,
  timeoutMs,
}: {
  signal?: AbortSignal;
  timeoutMs: number;
}) => {
  const abortController = new AbortController();
  let abortReason: ApiRequestAbortReason | null = null;

  const abort = (reason: ApiRequestAbortReason) => {
    if (abortController.signal.aborted) {
      return;
    }

    abortReason = reason;
    abortController.abort();
  };
  const handleExternalAbort = () => abort("cancelled");
  const timeoutId =
    timeoutMs > 0 ? setTimeout(() => abort("timeout"), timeoutMs) : undefined;

  if (signal?.aborted) {
    abort("cancelled");
  } else {
    signal?.addEventListener("abort", handleExternalAbort, { once: true });
  }

  return {
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      signal?.removeEventListener("abort", handleExternalAbort);
    },
    getAbortReason: () => abortReason,
    signal: abortController.signal,
  };
};

const parseJsonResponse = async <ResponseSchema extends z.ZodType>({
  errorName,
  getAbortReason,
  response,
  schema,
}: {
  errorName: string;
  getAbortReason: () => ApiRequestAbortReason | null;
  response: Response;
  schema: ResponseSchema;
}) => {
  const payload = (await response.json().catch(() => {
    const abortReason = getAbortReason();

    if (abortReason) {
      throw createAbortError({
        errorName,
        reason: abortReason,
      });
    }

    return undefined;
  })) as unknown;

  if (!response.ok) {
    throw new ApiRequestError({
      code: "requestFailed",
      message: getResponseErrorMessage(payload),
      name: errorName,
      status: response.status,
    });
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new ApiRequestError({
      code: "invalidResponse",
      message: "Invalid response",
      name: errorName,
    });
  }

  return parsedPayload.data as z.infer<ResponseSchema>;
};

const apiRequest = async <ResponseSchema extends z.ZodType>({
  accessToken,
  baseUrl = backendApiUrl,
  body,
  errorName = "ApiRequestError",
  headers: customHeaders,
  method,
  path,
  schema,
  signal,
  timeoutMs = defaultApiRequestTimeoutMs,
}: ApiRequestOptions<ResponseSchema>): Promise<z.infer<ResponseSchema>> => {
  const headers = new Headers(customHeaders);
  const composedSignal = createComposedSignal({ signal, timeoutMs });

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers,
      method,
      signal: composedSignal.signal,
    });

    return parseJsonResponse({
      errorName,
      getAbortReason: composedSignal.getAbortReason,
      response,
      schema,
    });
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    const abortReason = composedSignal.getAbortReason();

    if (abortReason) {
      throw createAbortError({
        errorName,
        reason: abortReason,
      });
    }

    throw new ApiRequestError({
      code: "connectionError",
      message: "Request failed",
      name: errorName,
    });
  } finally {
    composedSignal.cleanup();
  }
};

const isApiRequestCancellationError = (error: unknown) =>
  error instanceof ApiRequestError && error.code === "cancelled";

export {
  apiRequest,
  ApiRequestError,
  defaultApiRequestTimeoutMs,
  isApiRequestCancellationError,
};
export type { ApiRequestErrorCode, ApiRequestOptions };
