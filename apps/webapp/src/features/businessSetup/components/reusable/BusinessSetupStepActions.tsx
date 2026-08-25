"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/reusable";

type BusinessSetupStepActionsProperties = {
  formId?: string;
  hasChanges?: boolean;
  isCompletionAction?: boolean;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isSaving: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
};

export const BusinessSetupStepActions = ({
  formId,
  hasChanges = false,
  isCompletionAction = false,
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
    <div className="flex justify-end border-t border-line pt-4 xl:border-0 xl:pt-0">
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 sm:flex sm:justify-end">
        <Button
          isDisabled={isPreviousDisabled || !onPrevious}
          variant="outline"
          type="button"
          onClick={onPrevious}
        >
          {t("businessSetup.actions.previous")}
        </Button>
        <Button
          className="w-full sm:w-52"
          form={hasChanges ? formId : undefined}
          isDisabled={isNextActionDisabled}
          isLoading={isSaving}
          loadingText={t(
            isCompletionAction
              ? "businessSetup.actions.finishing"
              : "businessSetup.actions.saving",
          )}
          onClick={hasChanges ? undefined : onNext}
          type={hasChanges ? "submit" : "button"}
        >
          {t(
            isCompletionAction
              ? "businessSetup.actions.finish"
              : hasChanges
                ? "businessSetup.actions.saveAndContinue"
                : "businessSetup.actions.next",
          )}
          {isCompletionAction ? (
            <CheckIcon className="size-4" aria-hidden="true" />
          ) : (
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
};

export type { BusinessSetupStepActionsProperties };
