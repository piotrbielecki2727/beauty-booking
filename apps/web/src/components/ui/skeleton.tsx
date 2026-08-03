import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="skeleton"
    className={cn("animate-pulse rounded-2xl bg-muted", className)}
    {...props}
  />
)

export { Skeleton }
