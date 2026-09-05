"use client";

import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/reusable";

type UnsavedChangesDialogProperties = {
  isOpen: boolean;
  isSaving: boolean;
  onDiscard: () => void;
  onSaveAndLeave: () => Promise<void>;
  onStay: () => void;
};

export const UnsavedChangesDialog = ({
  isOpen,
  isSaving,
  onDiscard,
  onSaveAndLeave,
  onStay,
}: UnsavedChangesDialogProperties) => {
  const t = useTranslations();

  return (
    <ConfirmationDialog
      cancelLabel={t("managementSettings.salon.unsavedChanges.stay")}
      confirmLabel={t(
        "managementSettings.salon.unsavedChanges.discardAndLeave",
      )}
      confirmVariant="outline"
      description={t("managementSettings.salon.unsavedChanges.description")}
      extraActionLabel={t(
        "managementSettings.salon.unsavedChanges.saveAndLeave",
      )}
      extraActionVariant="default"
      hasSplitActions
      isExtraActionLoading={isSaving}
      isOpen={isOpen}
      onCancel={onStay}
      onConfirm={onDiscard}
      onExtraAction={() => void onSaveAndLeave()}
      title={t("managementSettings.salon.unsavedChanges.title")}
    />
  );
};

export type { UnsavedChangesDialogProperties };
