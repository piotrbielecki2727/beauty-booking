"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { appToast } from "@/features/notifications";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

import { getInvalidSalonSettingsFormIds } from "../businessSalonSettingsConfig";

import type { SalonSettingsFormState } from "../businessSalonSettingsConfig";
import type {
  BusinessBasicsForm,
  BusinessDetailsForm,
  BusinessLocationForm,
} from "@beauty-booking/shared";

type UseSalonSettingsNavigationGuardProperties = {
  formState: SalonSettingsFormState;
  isNavigationBlocked: boolean;
  saveBasics: (values: BusinessBasicsForm) => Promise<boolean | void>;
  saveDetails: (values: BusinessDetailsForm) => Promise<void>;
  saveLocation: (values: BusinessLocationForm) => Promise<void>;
};

const showValidationErrors = (formIds: string[]) => {
  formIds.forEach((formId) => {
    document.getElementById(formId)?.closest("form")?.requestSubmit();
  });
};

export const useSalonSettingsNavigationGuard = ({
  formState,
  isNavigationBlocked,
  saveBasics,
  saveDetails,
  saveLocation,
}: UseSalonSettingsNavigationGuardProperties) => {
  const t = useTranslations();
  const [isSavingForNavigation, setIsSavingForNavigation] = useState(false);
  const hasUnsavedChanges = Object.values(formState.dirtyState).some(Boolean);
  const navigationGuard = useUnsavedChangesGuard({
    hasUnsavedChanges,
    isNavigationBlocked: isNavigationBlocked || isSavingForNavigation,
  });

  const saveAndNavigate = async () => {
    const invalidFormIds = getInvalidSalonSettingsFormIds(formState);

    if (invalidFormIds.length > 0) {
      navigationGuard.cancelNavigation();
      showValidationErrors(invalidFormIds);
      return;
    }

    const { basics, details, location } = formState.validatedDrafts;

    setIsSavingForNavigation(true);

    try {
      if (basics.status === "valid") {
        const didSaveBasics = await saveBasics(basics.data);

        if (didSaveBasics === false) {
          navigationGuard.cancelNavigation();
          return;
        }
      }
      if (location.status === "valid") {
        await saveLocation(location.data);
      }
      if (details.status === "valid") {
        await saveDetails(details.data);
      }

      navigationGuard.confirmNavigation();
    } catch {
      navigationGuard.cancelNavigation();
      appToast.error({
        title: t("managementSettings.salon.unsavedChanges.saveFailed"),
      });
    } finally {
      setIsSavingForNavigation(false);
    }
  };

  return {
    cancelNavigation: navigationGuard.cancelNavigation,
    confirmNavigation: navigationGuard.confirmNavigation,
    isConfirmationOpen: navigationGuard.isConfirmationOpen,
    isSavingForNavigation,
    saveAndNavigate,
  };
};

export type { UseSalonSettingsNavigationGuardProperties };
