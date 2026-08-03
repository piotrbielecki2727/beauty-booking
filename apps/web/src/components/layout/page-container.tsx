import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type PageContainerProps = ComponentProps<"div">

const PageContainer = ({ className, ...props }: PageContainerProps) => (
  <div
    className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8", className)}
    {...props}
  />
)

export { PageContainer }
export type { PageContainerProps }
