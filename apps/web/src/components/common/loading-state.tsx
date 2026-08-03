import { LoaderCircle } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type LoadingStateProps = ComponentProps<"div"> & {
  message?: ReactNode
  variant?: "skeleton" | "spinner"
}

const LoadingState = ({
  className,
  message,
  variant = "spinner",
  ...props
}: LoadingStateProps) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("grid gap-3", className)} role="status" {...props}>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    )
  }

  return (
    <div
      className={cn("flex min-h-32 flex-col items-center justify-center gap-3 text-center", className)}
      role="status"
      {...props}
    >
      <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-primary" />
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  )
}

export { LoadingState }
export type { LoadingStateProps }
