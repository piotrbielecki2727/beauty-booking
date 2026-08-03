import { LoaderCircle } from "lucide-react"

type BookingLoadingOverlayProps = {
  description: string
  title: string
}

const BookingLoadingOverlay = ({ description, title }: BookingLoadingOverlayProps) => (
  <div
    aria-live="polite"
    aria-modal="true"
    className="fixed inset-0 z-50 grid place-items-center bg-background/55 p-6 backdrop-blur-md"
    role="dialog"
  >
    <div className="grid w-full max-w-sm justify-items-center gap-4 rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-lg">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
      </span>
      <div className="grid gap-2">
        <p className="font-heading text-xl font-semibold">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
)

export { BookingLoadingOverlay }
export type { BookingLoadingOverlayProps }
