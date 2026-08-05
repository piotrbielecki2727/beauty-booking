"use client"

import { AppButton } from "@/components/common/app-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ConfirmationDialogProps = {
  cancelLabel?: string
  confirmLabel?: string
  description: string
  extraActionLabel?: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  onExtraAction?: () => void
  title: string
}

const ConfirmationDialog = ({
  cancelLabel = "Zostań",
  confirmLabel = "Opuść",
  description,
  extraActionLabel,
  isOpen,
  onCancel,
  onConfirm,
  onExtraAction,
  title,
}: ConfirmationDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => (open ? undefined : onCancel())}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <AppButton onClick={onCancel} type="button" variant="outline">
          {cancelLabel}
        </AppButton>
        {extraActionLabel && onExtraAction ? (
          <AppButton onClick={onExtraAction} type="button" variant="outline">
            {extraActionLabel}
          </AppButton>
        ) : null}
        <AppButton onClick={onConfirm} type="button">
          {confirmLabel}
        </AppButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export { ConfirmationDialog }
export type { ConfirmationDialogProps }
