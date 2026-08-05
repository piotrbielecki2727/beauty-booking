import { Save } from "lucide-react"

import { AppButton } from "@/components/common/app-button"

type SaveActionProps = {
  isDirty: boolean
  onSave: () => void
  savedMessage: string | null
}

const SaveAction = ({ isDirty, onSave, savedMessage }: SaveActionProps) => (
  <div className="flex flex-col gap-2 sm:items-end">
    <AppButton disabled={!isDirty} onClick={onSave} type="button">
      <Save aria-hidden="true" />
      Zatwierdź
    </AppButton>
    <p className="min-h-5 text-xs leading-5 text-muted-foreground">
      {savedMessage ??
        (isDirty ? "Masz niezapisane zmiany." : "Brak zmian do zapisania.")}
    </p>
  </div>
)

export { SaveAction }
export type { SaveActionProps }
