"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/reusable";

type SalonSettingsSaveButtonProperties = {
  formId: string;
  hasValidationErrors: boolean;
  isDisabled: boolean;
  isDirty: boolean;
  isLoading: boolean;
};

export const SalonSettingsSaveButton = ({
  formId,
  hasValidationErrors,
  isDisabled,
  isDirty,
  isLoading,
}: SalonSettingsSaveButtonProperties) => {
  const t = useTranslations();

  return (
    <Button
      className="min-w-40"
      form={formId}
      isDisabled={isDisabled || hasValidationErrors || !isDirty}
      isLoading={isLoading}
      loadingText={t("managementSettings.salon.savingChanges")}
      type="submit"
    >
      {t("managementSettings.salon.saveChanges")}
    </Button>
  );
};

export type { SalonSettingsSaveButtonProperties };
