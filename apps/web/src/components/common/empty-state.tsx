import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = ComponentProps<"div"> & {
  action?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  title: ReactNode
}

const EmptyState = ({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/55 px-6 py-10 text-center",
      className
    )}
    {...props}
  >
    {icon ? (
      <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        {icon}
      </div>
    ) : null}
    <div className="grid max-w-sm gap-2">
      <h3 className="font-heading text-xl font-medium">{title}</h3>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
    {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
  </div>
)

export { EmptyState }
export type { EmptyStateProps }
