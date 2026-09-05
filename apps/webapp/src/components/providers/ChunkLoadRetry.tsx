"use client";

import { useEffect } from "react";

const chunkLoadRetryStorageKey = "beauty-booking:chunk-load-retry";
const chunkLoadRetryWindowMs = 10_000;

const isNextStaticChunkUrl = (value: string) =>
  value.includes("/_next/static/chunks/");

const getFailedAssetUrl = (target: EventTarget | null) => {
  if (target instanceof HTMLScriptElement) {
    return target.src;
  }

  if (target instanceof HTMLLinkElement) {
    return target.href;
  }

  return "";
};

const getLastRetry = () => {
  const retryValue = window.sessionStorage.getItem(chunkLoadRetryStorageKey);

  if (!retryValue) {
    return null;
  }

  try {
    return JSON.parse(retryValue) as {
      pathname?: string;
      retriedAt?: number;
    };
  } catch {
    return null;
  }
};

const shouldRetryChunkLoad = () => {
  const retry = getLastRetry();
  const now = Date.now();

  if (
    retry?.pathname === window.location.pathname &&
    typeof retry.retriedAt === "number" &&
    now - retry.retriedAt < chunkLoadRetryWindowMs
  ) {
    return false;
  }

  window.sessionStorage.setItem(
    chunkLoadRetryStorageKey,
    JSON.stringify({
      pathname: window.location.pathname,
      retriedAt: now,
    }),
  );

  return true;
};

export const ChunkLoadRetry = () => {
  useEffect(() => {
    const clearRetryMarker = window.setTimeout(() => {
      window.sessionStorage.removeItem(chunkLoadRetryStorageKey);
    }, chunkLoadRetryWindowMs);

    const retry = () => {
      if (shouldRetryChunkLoad()) {
        window.location.reload();
      }
    };

    const handleResourceError = (event: ErrorEvent) => {
      if (isNextStaticChunkUrl(getFailedAssetUrl(event.target))) {
        retry();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error ? reason.message : String(reason ?? "");

      if (message.includes("ChunkLoadError")) {
        retry();
      }
    };

    window.addEventListener("error", handleResourceError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.clearTimeout(clearRetryMarker);
      window.removeEventListener("error", handleResourceError, true);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null;
};
