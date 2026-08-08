"use client";

import { toast } from "sonner";

type AppToastOptions = {
  description?: string;
  duration?: number;
};

type AppToastPayload = AppToastOptions & {
  title: string;
};

export const appToast = {
  error: ({ description, duration, title }: AppToastPayload) =>
    toast.error(title, {
      description,
      duration,
    }),
  info: ({ description, duration, title }: AppToastPayload) =>
    toast.info(title, {
      description,
      duration,
    }),
  success: ({ description, duration, title }: AppToastPayload) =>
    toast.success(title, {
      description,
      duration,
    }),
  warning: ({ description, duration, title }: AppToastPayload) =>
    toast.warning(title, {
      description,
      duration,
    }),
};

export type { AppToastOptions, AppToastPayload };
