"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

import { appToast } from "@/features/notifications";

import type { BusinessBasicsForm, BusinessType } from "@beauty-booking/shared";

type UseBusinessTypeChangeProperties = {
  isProviderSaving: boolean;
  isSectionSavePending: boolean;
  persistedBusinessType?: BusinessType | null;
  saveBasics: (values: BusinessBasicsForm) => Promise<void>;
  saveBasicsSection: (values: BusinessBasicsForm) => Promise<void>;
  updateBusinessName: (name: string) => void;
};

export const useBusinessTypeChange = ({
  isProviderSaving,
  isSectionSavePending,
  persistedBusinessType,
  saveBasics,
  saveBasicsSection,
  updateBusinessName,
}: UseBusinessTypeChangeProperties) => {
  const t = useTranslations();
  const [pendingBasicsValues, setPendingBasicsValues] =
    useState<BusinessBasicsForm | null>(null);
  const [basicsFormVersion, setBasicsFormVersion] = useState(0);
  const [isChangingBusinessType, setIsChangingBusinessType] = useState(false);

  const saveBasicsWithBusinessTypeCheck = useCallback(
    async (values: BusinessBasicsForm) => {
      if (
        persistedBusinessType &&
        values.businessType !== persistedBusinessType
      ) {
        setPendingBasicsValues(values);
        return false;
      }

      await saveBasicsSection(values);
      updateBusinessName(values.name);
    },
    [persistedBusinessType, saveBasicsSection, updateBusinessName],
  );

  const cancelBusinessTypeChange = useCallback(() => {
    setPendingBasicsValues(null);
  }, []);

  const confirmBusinessTypeChange = useCallback(async () => {
    if (
      !pendingBasicsValues ||
      isChangingBusinessType ||
      isProviderSaving ||
      isSectionSavePending
    ) {
      return;
    }

    const valuesToSave = pendingBasicsValues;

    setPendingBasicsValues(null);
    setIsChangingBusinessType(true);

    try {
      await saveBasics(valuesToSave);
      updateBusinessName(valuesToSave.name);
      setBasicsFormVersion((currentVersion) => currentVersion + 1);
    } catch {
      appToast.error({
        title: t("managementSettings.salon.businessType.changeFailed"),
      });
    } finally {
      setIsChangingBusinessType(false);
    }
  }, [
    isChangingBusinessType,
    isProviderSaving,
    isSectionSavePending,
    pendingBasicsValues,
    saveBasics,
    t,
    updateBusinessName,
  ]);

  return {
    basicsFormVersion,
    cancelBusinessTypeChange,
    confirmBusinessTypeChange,
    isBusinessTypeDialogOpen: pendingBasicsValues !== null,
    isChangingBusinessType,
    pendingBusinessType: pendingBasicsValues?.businessType ?? null,
    saveBasicsWithBusinessTypeCheck,
  };
};

export type { UseBusinessTypeChangeProperties };
