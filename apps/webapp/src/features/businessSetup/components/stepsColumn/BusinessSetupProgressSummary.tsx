"use client";

import { useTranslations } from "next-intl";

type BusinessSetupProgressSummaryProperties = {
  currentStepNumber: number;
  progressPercentage: number;
  totalSteps: number;
};

export const BusinessSetupProgressSummary = ({
  currentStepNumber,
  progressPercentage,
  totalSteps,
}: BusinessSetupProgressSummaryProperties) => {
  const t = useTranslations();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-brand text-lg font-semibold text-brand">
          {t("businessSetup.progress", {
            current: currentStepNumber,
            total: totalSteps,
          })}
        </p>
        <p className="text-base font-medium text-copy-muted">
          {t("businessSetup.progressPercentage", {
            percentage: progressPercentage,
          })}
        </p>
      </div>
      <div
        aria-label={t("businessSetup.progressLabel", {
          percentage: progressPercentage,
        })}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressPercentage}
        className="h-1.5 overflow-hidden rounded-full bg-surface"
        role="progressbar"
      >
        <span
          className="block h-full rounded-full bg-brand"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export type { BusinessSetupProgressSummaryProperties };
