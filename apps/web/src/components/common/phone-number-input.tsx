import type { ComponentProps } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PhoneNumberInputProps = ComponentProps<"input">

const PhoneNumberInput = ({ className, ...props }: PhoneNumberInputProps) => (
  <div className="relative">
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center border-r border-border/70 pr-2 text-sm font-medium text-muted-foreground">
      +48
    </span>
    <Input className={cn("pl-14", className)} {...props} />
  </div>
)

export { PhoneNumberInput }
export type { PhoneNumberInputProps }
