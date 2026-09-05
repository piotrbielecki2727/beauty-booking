"use client";

import { ContactRoundIcon, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { BusinessDetailsStep } from "@/features/businessSetup/components";
import { businessSetupFieldClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { SalonSettingsSection } from "@/features/businessSettings/components/SalonSettingsSection";

import { salonSettingsFormIds } from "../businessSalonSettingsConfig";
import { SalonSettingsSaveButton } from "../components/SalonSettingsSaveButton";

import type {
  BusinessDetailsForm,
  BusinessSetupResponse,
} from "@beauty-booking/shared";

type BusinessProfileSettingsSectionProperties = {
  draft?: BusinessDetailsForm;
  hasValidationErrors: boolean;
  isDirty: boolean;
  isFormDisabled: boolean;
  isSaveDisabled: boolean;
  isSaving: boolean;
  onDraftChange: (values: BusinessDetailsForm) => void;
  onSave: (values: BusinessDetailsForm) => Promise<void>;
  setup: BusinessSetupResponse;
};

export const BusinessProfileSettingsSection = ({
  draft,
  hasValidationErrors,
  isDirty,
  isFormDisabled,
  isSaveDisabled,
  isSaving,
  onDraftChange,
  onSave,
  setup,
}: BusinessProfileSettingsSectionProperties) => {
  const t = useTranslations();

  return (
    <SalonSettingsSection
      className="order-2"
      description={t(
        "managementSettings.salon.sections.customerData.description",
      )}
      footer={
        <SalonSettingsSaveButton
          formId={salonSettingsFormIds.details}
          hasValidationErrors={hasValidationErrors}
          isDisabled={isSaveDisabled}
          isDirty={isDirty}
          isLoading={isSaving}
        />
      }
      icon={<ContactRoundIcon />}
      isContentScrollable
      title={t("managementSettings.salon.sections.customerData.title")}
    >
      <BusinessDetailsStep
        draft={draft}
        fieldClassName={businessSetupFieldClassNames}
        formId={salonSettingsFormIds.details}
        initialSetup={setup}
        isDescriptionVisible
        isDisabled={isFormDisabled}
        isExtendedSocialMediaVisible={false}
        isLogoVisible={false}
        onDraftChange={onDraftChange}
        onSave={onSave}
        shouldSyncInitialValues={false}
      />

      <div className="flex gap-3 rounded-lg border border-line bg-surface p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <ImageIcon className="size-4" aria-hidden="true" />
        </span>
        <div className="grid gap-1">
          <p className="text-sm font-semibold text-copy">
            {t("managementSettings.salon.fields.logo")}
          </p>
          <p className="text-sm leading-5 text-copy-muted">
            {t("managementSettings.salon.logoStoragePending")}
          </p>
        </div>
      </div>
    </SalonSettingsSection>
  );
};

export type { BusinessProfileSettingsSectionProperties };
