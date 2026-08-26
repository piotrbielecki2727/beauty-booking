"use client";

import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/reusable";

type BusinessSetupNavigationDialogsProperties = {
  isPageNavigationDialogOpen: boolean;
  isStepChangeDialogOpen: boolean;
  onCancelPageNavigation: () => void;
  onCancelStepChange: () => void;
  onConfirmPageNavigation: () => void;
  onDiscardStepChanges: () => void;
  onSaveAndChangeStep: () => void;
};

export const BusinessSetupNavigationDialogs = ({
  isPageNavigationDialogOpen,
  isStepChangeDialogOpen,
  onCancelPageNavigation,
  onCancelStepChange,
  onConfirmPageNavigation,
  onDiscardStepChanges,
  onSaveAndChangeStep,
}: BusinessSetupNavigationDialogsProperties) => {
  const t = useTranslations();

  return (
    <>
      <ConfirmationDialog
        cancelLabel={t("businessSetup.unsavedChanges.stay")}
        confirmLabel={t("businessSetup.unsavedChanges.leave")}
        description={t("businessSetup.unsavedChanges.description")}
        isOpen={isPageNavigationDialogOpen}
        onCancel={onCancelPageNavigation}
        onConfirm={onConfirmPageNavigation}
        title={t("businessSetup.unsavedChanges.title")}
      />

      <ConfirmationDialog
        cancelLabel={t("businessSetup.unsavedStepChange.stay")}
        confirmLabel={t("businessSetup.unsavedStepChange.leave")}
        confirmVariant="outline"
        description={t("businessSetup.unsavedStepChange.description")}
        extraActionLabel={t("businessSetup.unsavedStepChange.saveAndLeave")}
        extraActionVariant="default"
        hasSplitActions
        isOpen={isStepChangeDialogOpen}
        onCancel={onCancelStepChange}
        onConfirm={onDiscardStepChanges}
        onExtraAction={onSaveAndChangeStep}
        title={t("businessSetup.unsavedStepChange.title")}
      />
    </>
  );
};

export type { BusinessSetupNavigationDialogsProperties };
