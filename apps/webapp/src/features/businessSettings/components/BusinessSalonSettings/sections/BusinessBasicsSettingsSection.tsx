"use client";

import { StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { BusinessBasicsStep } from "@/features/businessSetup/components";
import { businessSetupFieldClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { SalonSettingsSection } from "@/features/businessSettings/components/SalonSettingsSection";

import { salonSettingsFormIds } from "../businessSalonSettingsConfig";
import { SalonSettingsSaveButton } from "../components/SalonSettingsSaveButton";

import type {
  BusinessBasicsForm,
  BusinessSetupResponse,
} from "@beauty-booking/shared";

type BusinessBasicsSettingsSectionProperties = {
  draft?: BusinessBasicsForm;
  formVersion: number;
  hasValidationErrors: boolean;
  isDirty: boolean;
  isFormDisabled: boolean;
  isSaveDisabled: boolean;
  isSaving: boolean;
  onDraftChange: (values: BusinessBasicsForm) => void;
  onSave: (values: BusinessBasicsForm) => Promise<boolean | void>;
  setup: BusinessSetupResponse;
};

export const BusinessBasicsSettingsSection = ({
  draft,
  formVersion,
  hasValidationErrors,
  isDirty,
  isFormDisabled,
  isSaveDisabled,
  isSaving,
  onDraftChange,
  onSave,
  setup,
}: BusinessBasicsSettingsSectionProperties) => {
  const t = useTranslations();

  return (
    <SalonSettingsSection
      description={t("managementSettings.salon.sections.basics.description")}
      footer={
        <SalonSettingsSaveButton
          formId={salonSettingsFormIds.basics}
          hasValidationErrors={hasValidationErrors}
          isDisabled={isSaveDisabled}
          isDirty={isDirty}
          isLoading={isSaving}
        />
      }
      icon={<StoreIcon />}
      isContentScrollable
      title={t("managementSettings.salon.sections.basics.title")}
    >
      <BusinessBasicsStep
        key={formVersion}
        draft={draft}
        fieldClassName={businessSetupFieldClassNames}
        formId={salonSettingsFormIds.basics}
        initialSetup={setup}
        isDisabled={isFormDisabled}
        onDraftChange={onDraftChange}
        onSave={onSave}
        shouldSyncInitialValues={false}
      />
    </SalonSettingsSection>
  );
};

export type { BusinessBasicsSettingsSectionProperties };
