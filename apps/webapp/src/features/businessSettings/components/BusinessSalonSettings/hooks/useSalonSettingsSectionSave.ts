"use client";

import { useCallback, useState } from "react";

import type { SalonSettingsSection } from "../businessSalonSettingsConfig";

const minimumSavingFeedbackMs = 600;

const waitForMinimumSavingFeedback = async (startedAt: number) => {
  const remainingTime = minimumSavingFeedbackMs - (Date.now() - startedAt);

  if (remainingTime > 0) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, remainingTime);
    });
  }
};

export const useSalonSettingsSectionSave = () => {
  const [savingSection, setSavingSection] =
    useState<SalonSettingsSection | null>(null);

  const saveSection = useCallback(
    async <Values,>(
      section: SalonSettingsSection,
      values: Values,
      save: (nextValues: Values) => Promise<void>,
    ) => {
      const startedAt = Date.now();

      setSavingSection(section);

      try {
        await save(values);
      } finally {
        await waitForMinimumSavingFeedback(startedAt);
        window.setTimeout(() => {
          setSavingSection((currentSection) =>
            currentSection === section ? null : currentSection,
          );
        }, 0);
      }
    },
    [],
  );

  return {
    isSectionSavePending: savingSection !== null,
    saveSection,
    savingSection,
  };
};
