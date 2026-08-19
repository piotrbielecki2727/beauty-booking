"use client";

import { useTranslations } from "next-intl";

type BusinessSetupProgressSummaryProperties = {
  completedPercentage: number;
  currentStepNumber: number;
  totalSteps: number;
};

export const BusinessSetupProgressSummary = ({
  completedPercentage,
  currentStepNumber,
  totalSteps,
}: BusinessSetupProgressSummaryProperties) => {
  const t = useTranslations();

  return (
    <div className="grid gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy">
        {t("businessSetup.progress", {
          current: currentStepNumber,
          total: totalSteps,
        })}
      </p>
      <div
        aria-label={t("businessSetup.progressCompleted", {
          percentage: completedPercentage,
        })}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={completedPercentage}
        className="h-1.5 overflow-hidden rounded-full bg-surface"
        role="progressbar"
      >
        <span
          className="block h-full rounded-full bg-brand"
          style={{ width: `${completedPercentage}%` }}
        />
      </div>
      <p className="text-sm text-copy-muted">
        {t("businessSetup.progressCompleted", {
          percentage: completedPercentage,
        })}
      </p>
    </div>
  );
};

export type { BusinessSetupProgressSummaryProperties };
