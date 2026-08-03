"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = ({ className, ...props }: CheckboxPrimitive.Root.Props) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    className={cn(
      "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-primary-foreground transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none data-checked:border-primary data-checked:bg-primary disabled:cursor-default disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check aria-hidden="true" className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

export { Checkbox }
