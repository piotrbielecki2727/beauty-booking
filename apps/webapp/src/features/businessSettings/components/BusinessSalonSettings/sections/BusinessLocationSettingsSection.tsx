"use client";

import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { BusinessLocationStep } from "@/features/businessSetup/components";
import { SalonSettingsSection } from "@/features/businessSettings/components/SalonSettingsSection";

import { salonSettingsFormIds } from "../businessSalonSettingsConfig";
import { SalonSettingsSaveButton } from "../components/SalonSettingsSaveButton";

import type {
  BusinessLocationForm,
  BusinessSetupResponse,
} from "@beauty-booking/shared";

type BusinessLocationSettingsSectionProperties = {
  draft?: BusinessLocationForm;
  hasValidationErrors: boolean;
  isDirty: boolean;
  isFormDisabled: boolean;
  isSaveDisabled: boolean;
  isSaving: boolean;
  onDraftChange: (values: BusinessLocationForm) => void;
  onSave: (values: BusinessLocationForm) => Promise<void>;
  setup: BusinessSetupResponse;
};

export const BusinessLocationSettingsSection = ({
  draft,
  hasValidationErrors,
  isDirty,
  isFormDisabled,
  isSaveDisabled,
  isSaving,
  onDraftChange,
  onSave,
  setup,
}: BusinessLocationSettingsSectionProperties) => {
  const t = useTranslations();

  return (
    <SalonSettingsSection
      className="order-3 xl:col-span-2"
      description={t(
        "managementSettings.salon.sections.location.description",
      )}
      footer={
        <SalonSettingsSaveButton
          formId={salonSettingsFormIds.location}
          hasValidationErrors={hasValidationErrors}
          isDisabled={isSaveDisabled}
          isDirty={isDirty}
          isLoading={isSaving}
        />
      }
      icon={<MapPinIcon />}
      title={t("managementSettings.salon.sections.location.title")}
    >
      <BusinessLocationStep
        draft={draft}
        formId={salonSettingsFormIds.location}
        initialSetup={setup}
        isDisabled={isFormDisabled}
        onDraftChange={onDraftChange}
        onSave={onSave}
        shouldSyncInitialValues={false}
      />
    </SalonSettingsSection>
  );
};

export type { BusinessLocationSettingsSectionProperties };
