import { CircleAlert } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type ErrorStateProps = ComponentProps<"div"> & {
  description?: ReactNode
  retryAction?: ReactNode
  title: ReactNode
}

const ErrorState = ({
  className,
  description,
  retryAction,
  title,
  ...props
}: ErrorStateProps) => (
  <div
    className={cn(
      "flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-card px-6 py-10 text-center shadow-sm",
      className
    )}
    role="status"
    {...props}
  >
    <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
      <CircleAlert aria-hidden="true" />
    </div>
    <div className="grid max-w-sm gap-2">
      <h3 className="font-heading text-xl font-medium">{title}</h3>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
    {retryAction ? <div className="flex flex-wrap justify-center gap-2">{retryAction}</div> : null}
  </div>
)

export { ErrorState }
export type { ErrorStateProps }
