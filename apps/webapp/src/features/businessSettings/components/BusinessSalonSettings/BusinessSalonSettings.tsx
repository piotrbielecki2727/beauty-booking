"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { LoadingOverlay, Tabs } from "@/components/reusable";
import { useBusinessSetup } from "@/features/businessSetup/providers";
import { useTenantContext } from "@/features/tenant";

import { getSalonSettingsFormState } from "./businessSalonSettingsConfig";
import { BusinessTypeChangeDialog } from "./components/BusinessTypeChangeDialog";
import { UnsavedChangesDialog } from "./components/UnsavedChangesDialog";
import { useBusinessTypeChange } from "./hooks/useBusinessTypeChange";
import { useSalonSettingsNavigationGuard } from "./hooks/useSalonSettingsNavigationGuard";
import { useSalonSettingsSectionSave } from "./hooks/useSalonSettingsSectionSave";
import { BusinessBasicsSettingsSection } from "./sections/BusinessBasicsSettingsSection";
import { BusinessLocationSettingsSection } from "./sections/BusinessLocationSettingsSection";
import { BusinessProfileSettingsSection } from "./sections/BusinessProfileSettingsSection";

import type {
  BusinessBasicsForm,
  BusinessDetailsForm,
  BusinessLocationForm,
} from "@beauty-booking/shared";

export const BusinessSalonSettings = () => {
  const t = useTranslations();
  const { updateBusinessName } = useTenantContext();
  const {
    drafts,
    isSaving,
    isSetupLoading,
    saveBasics,
    saveDetails,
    saveLocation,
    setDraft,
    setup,
  } = useBusinessSetup();
  const { isSectionSavePending, saveSection, savingSection } =
    useSalonSettingsSectionSave();

  const saveBasicsSection = useCallback(
    (values: BusinessBasicsForm) =>
      saveSection("basics", values, saveBasics),
    [saveBasics, saveSection],
  );
  const saveDetailsSection = useCallback(
    (values: BusinessDetailsForm) =>
      saveSection("details", values, saveDetails),
    [saveDetails, saveSection],
  );
  const saveLocationSection = useCallback(
    (values: BusinessLocationForm) =>
      saveSection("location", values, saveLocation),
    [saveLocation, saveSection],
  );
  const businessTypeChange = useBusinessTypeChange({
    isProviderSaving: isSaving,
    isSectionSavePending,
    persistedBusinessType: setup?.basics.businessType,
    saveBasics,
    saveBasicsSection,
    updateBusinessName,
  });
  const formState = getSalonSettingsFormState(drafts);
  const navigationGuard = useSalonSettingsNavigationGuard({
    formState,
    isNavigationBlocked:
      isSaving ||
      isSectionSavePending ||
      businessTypeChange.isChangingBusinessType,
    saveBasics: businessTypeChange.saveBasicsWithBusinessTypeCheck,
    saveDetails: saveDetailsSection,
    saveLocation: saveLocationSection,
  });

  const handleBasicsDraftChange = useCallback(
    (values: BusinessBasicsForm) => setDraft("BUSINESS_BASICS", values),
    [setDraft],
  );
  const handleDetailsDraftChange = useCallback(
    (values: BusinessDetailsForm) => setDraft("PUBLIC_PROFILE", values),
    [setDraft],
  );
  const handleLocationDraftChange = useCallback(
    (values: BusinessLocationForm) => setDraft("LOCATION", values),
    [setDraft],
  );

  if (isSetupLoading || !setup) {
    return (
      <div className="relative min-h-80 flex-1">
        <LoadingOverlay scope="container" variant="bare" />
      </div>
    );
  }

  const isSaveDisabled =
    isSectionSavePending || navigationGuard.isSavingForNavigation;

  return (
    <>
      <Tabs
        ariaLabel={t("managementSettings.tabsLabel")}
        defaultValue="salon"
        items={[
          {
            content: (
              <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
                <BusinessBasicsSettingsSection
                  draft={drafts.BUSINESS_BASICS}
                  formVersion={businessTypeChange.basicsFormVersion}
                  hasValidationErrors={formState.validationState.basics}
                  isDirty={formState.dirtyState.basics}
                  isFormDisabled={
                    savingSection === "basics" ||
                    navigationGuard.isSavingForNavigation
                  }
                  isSaveDisabled={isSaveDisabled}
                  isSaving={savingSection === "basics"}
                  onDraftChange={handleBasicsDraftChange}
                  onSave={
                    businessTypeChange.saveBasicsWithBusinessTypeCheck
                  }
                  setup={setup}
                />
                <BusinessLocationSettingsSection
                  draft={drafts.LOCATION}
                  hasValidationErrors={formState.validationState.location}
                  isDirty={formState.dirtyState.location}
                  isFormDisabled={
                    savingSection === "location" ||
                    navigationGuard.isSavingForNavigation
                  }
                  isSaveDisabled={isSaveDisabled}
                  isSaving={savingSection === "location"}
                  onDraftChange={handleLocationDraftChange}
                  onSave={saveLocationSection}
                  setup={setup}
                />
                <BusinessProfileSettingsSection
                  draft={drafts.PUBLIC_PROFILE}
                  hasValidationErrors={formState.validationState.details}
                  isDirty={formState.dirtyState.details}
                  isFormDisabled={
                    savingSection === "details" ||
                    navigationGuard.isSavingForNavigation
                  }
                  isSaveDisabled={isSaveDisabled}
                  isSaving={savingSection === "details"}
                  onDraftChange={handleDetailsDraftChange}
                  onSave={saveDetailsSection}
                  setup={setup}
                />
              </div>
            ),
            label: t("managementSettings.salon.tabLabel"),
            value: "salon",
          },
        ]}
      />

      <BusinessTypeChangeDialog
        isOpen={businessTypeChange.isBusinessTypeDialogOpen}
        onCancel={businessTypeChange.cancelBusinessTypeChange}
        onConfirm={businessTypeChange.confirmBusinessTypeChange}
        pendingBusinessType={businessTypeChange.pendingBusinessType}
      />
      <UnsavedChangesDialog
        isOpen={navigationGuard.isConfirmationOpen}
        isSaving={navigationGuard.isSavingForNavigation}
        onDiscard={navigationGuard.confirmNavigation}
        onSaveAndLeave={navigationGuard.saveAndNavigate}
        onStay={navigationGuard.cancelNavigation}
      />
      <LoadingOverlay
        isOpen={businessTypeChange.isChangingBusinessType}
        variant="bare"
      />
    </>
  );
};
