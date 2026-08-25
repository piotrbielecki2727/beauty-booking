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
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";
import type { ButtonProperties } from "@/components/ui/button";

type ConfirmationDialogProperties = {
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  description: ReactNode;
  extraActionLabel?: ReactNode;
  extraActionVariant?: ButtonProperties["variant"];
  hasSplitActions?: boolean;
  confirmVariant?: ButtonProperties["variant"];
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
  extraActionVariant = "outline",
  hasSplitActions = false,
  confirmVariant = "default",
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
      <DialogContent className={cn(hasSplitActions && "sm:max-w-2xl")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter
          className={cn(hasSplitActions && "sm:justify-between")}
        >
          <Button onClick={onCancel} type="button" variant="outline">
            {cancelLabel ?? t("confirmationDialog.cancel")}
          </Button>

          {hasSplitActions && extraActionLabel && onExtraAction ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                isLoading={isConfirmLoading}
                onClick={onConfirm}
                type="button"
                variant={confirmVariant}
              >
                {confirmLabel ?? t("confirmationDialog.confirm")}
              </Button>
              <Button
                onClick={onExtraAction}
                type="button"
                variant={extraActionVariant}
              >
                {extraActionLabel}
              </Button>
            </div>
          ) : (
            <>
              {extraActionLabel && onExtraAction ? (
                <Button
                  onClick={onExtraAction}
                  type="button"
                  variant={extraActionVariant}
                >
                  {extraActionLabel}
                </Button>
              ) : null}

              <Button
                isLoading={isConfirmLoading}
                onClick={onConfirm}
                type="button"
                variant={confirmVariant}
              >
                {confirmLabel ?? t("confirmationDialog.confirm")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { ConfirmationDialogProperties };
