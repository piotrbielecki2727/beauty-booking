import { Input as InputPrimitive } from "@base-ui/react/input"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const Input = ({ className, type, ...props }: ComponentProps<"input">) => (
  <InputPrimitive
    type={type}
    data-slot="input"
    className={cn(
      "h-9 w-full min-w-0 rounded-3xl border border-border/70 bg-input/45 px-3 py-1 text-base transition-[border-color,color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-primary/35 focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
      className
    )}
    {...props}
  />
)

export { Input }
