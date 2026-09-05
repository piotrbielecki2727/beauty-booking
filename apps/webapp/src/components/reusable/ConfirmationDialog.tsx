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
  contentClassName?: string;
  description: ReactNode;
  footerClassName?: string;
  extraActionLabel?: ReactNode;
  extraActionVariant?: ButtonProperties["variant"];
  hasSplitActions?: boolean;
  confirmVariant?: ButtonProperties["variant"];
  isConfirmLoading?: boolean;
  isExtraActionLoading?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onExtraAction?: () => void;
  title: ReactNode;
};

export const ConfirmationDialog = ({
  cancelLabel,
  confirmLabel,
  contentClassName,
  description,
  extraActionLabel,
  extraActionVariant = "outline",
  footerClassName,
  hasSplitActions = false,
  confirmVariant = "default",
  isConfirmLoading = false,
  isExtraActionLoading = false,
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
        if (
          !isDialogOpen &&
          !isConfirmLoading &&
          !isExtraActionLoading
        ) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className={cn(hasSplitActions && "sm:max-w-2xl", contentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter
          className={cn(
            hasSplitActions && "sm:justify-between",
            footerClassName,
          )}
        >
          <Button
            isDisabled={isConfirmLoading || isExtraActionLoading}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {cancelLabel ?? t("confirmationDialog.cancel")}
          </Button>

          {hasSplitActions && extraActionLabel && onExtraAction ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                isDisabled={isExtraActionLoading}
                isLoading={isConfirmLoading}
                onClick={onConfirm}
                type="button"
                variant={confirmVariant}
              >
                {confirmLabel ?? t("confirmationDialog.confirm")}
              </Button>
              <Button
                isDisabled={isConfirmLoading}
                isLoading={isExtraActionLoading}
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
                  isDisabled={isConfirmLoading}
                  isLoading={isExtraActionLoading}
                  onClick={onExtraAction}
                  type="button"
                  variant={extraActionVariant}
                >
                  {extraActionLabel}
                </Button>
              ) : null}

              <Button
                isDisabled={isExtraActionLoading}
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
