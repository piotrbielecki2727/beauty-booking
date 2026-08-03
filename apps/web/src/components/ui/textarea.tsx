import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const Textarea = ({ className, ...props }: ComponentProps<"textarea">) => (
  <textarea
    data-slot="textarea"
    className={cn(
      "flex field-sizing-content min-h-16 w-full resize-none rounded-2xl border border-border/70 bg-input/45 px-3 py-3 text-base transition-[border-color,color,box-shadow,background-color] outline-none placeholder:text-muted-foreground hover:border-primary/35 focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-default disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
      className
    )}
    {...props}
  />
)

export { Textarea }
