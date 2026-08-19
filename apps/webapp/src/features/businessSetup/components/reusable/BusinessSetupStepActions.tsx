"use client";

import { ArrowRightIcon, Clock3Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/reusable";
import { Link } from "@/i18n/navigation";

type BusinessSetupStepActionsProperties = {
  formId?: string;
  hasChanges?: boolean;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isSaving: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
};

export const BusinessSetupStepActions = ({
  formId,
  hasChanges = false,
  isNextDisabled = false,
  isPreviousDisabled = false,
  isSaving,
  onNext,
  onPrevious,
}: BusinessSetupStepActionsProperties) => {
  const t = useTranslations();
  const isNextActionDisabled =
    isSaving ||
    isNextDisabled ||
    (hasChanges ? !formId : !onNext);

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-line pt-4 @min-[40rem]/wizard:flex-row @min-[40rem]/wizard:items-center @min-[40rem]/wizard:justify-between">
      <Button
        className="border-line bg-background text-brand hover:border-brand hover:bg-surface-hover hover:text-brand-hover"
        variant="outline"
        render={<Link href="/management" />}
      >
        <Clock3Icon className="size-4" aria-hidden="true" />
        {t("businessSetup.actions.finishLater")}
      </Button>

      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 @min-[40rem]/wizard:flex @min-[40rem]/wizard:justify-end">
        <Button
          isDisabled={isSaving || isPreviousDisabled || !onPrevious}
          variant="outline"
          type="button"
          onClick={onPrevious}
        >
          {t("businessSetup.actions.previous")}
        </Button>
        <Button
          className="w-full @min-[40rem]/wizard:w-52"
          form={hasChanges ? formId : undefined}
          isDisabled={isNextActionDisabled}
          isLoading={isSaving}
          loadingText={t("businessSetup.actions.saving")}
          onClick={hasChanges ? undefined : onNext}
          type={hasChanges ? "submit" : "button"}
        >
          {t(
            hasChanges
              ? "businessSetup.actions.saveAndContinue"
              : "businessSetup.actions.next",
          )}
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export type { BusinessSetupStepActionsProperties };
