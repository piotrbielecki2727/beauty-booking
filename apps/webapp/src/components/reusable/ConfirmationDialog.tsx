"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/reusable/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ReactNode } from "react";

type ConfirmationDialogProperties = {
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  description: ReactNode;
  extraActionLabel?: ReactNode;
  isConfirmLoading?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onExtraAction?: () => void;
  title: ReactNode;
};

export const ConfirmationDialog = ({
  cancelLabel,
  confirmLabel,
  description,
  extraActionLabel,
  isConfirmLoading = false,
  isOpen,
  onCancel,
  onConfirm,
  onExtraAction,
  title,
}: ConfirmationDialogProperties) => {
  const t = useTranslations();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (!isDialogOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onCancel} type="button" variant="outline">
            {cancelLabel ?? t("confirmationDialog.cancel")}
          </Button>

          {extraActionLabel && onExtraAction ? (
            <Button onClick={onExtraAction} type="button" variant="outline">
              {extraActionLabel}
            </Button>
          ) : null}

          <Button
            isLoading={isConfirmLoading}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel ?? t("confirmationDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { ConfirmationDialogProperties };
