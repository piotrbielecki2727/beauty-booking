import type { ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AppTooltipSide = "bottom" | "right" | "top"

type AppTooltipProps = {
  children: ReactNode
  className?: string
  content: ReactNode
  isDisabled?: boolean
  side?: AppTooltipSide
}

const AppTooltip = ({
  children,
  className,
  content,
  isDisabled = false,
  side = "top",
}: AppTooltipProps) => {
  if (isDisabled) {
    return <span className={cn("inline-flex", className)}>{children}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span className={cn("inline-flex", className)} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent className="z-[90]" side={side} sideOffset={10}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export { AppTooltip }
export type { AppTooltipProps, AppTooltipSide }
