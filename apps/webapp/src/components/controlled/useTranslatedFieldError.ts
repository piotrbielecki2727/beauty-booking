"use client";

import { useTranslations } from "next-intl";

const validationMessagePrefix = "validation.";

export const useTranslatedFieldError = (message?: string) => {
  const t = useTranslations();

  if (!message) {
    return undefined;
  }

  if (!message.startsWith(validationMessagePrefix)) {
    return message;
  }

  return t(message);
};
