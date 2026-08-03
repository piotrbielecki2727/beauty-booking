import { LoaderCircle } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AppButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean
  fullWidth?: boolean
  loadingText?: string
}

const AppButton = ({
  children,
  className,
  disabled,
  fullWidth = false,
  isLoading = false,
  loadingText,
  ...props
}: AppButtonProps) => (
  <Button
    aria-busy={isLoading || undefined}
    className={cn(fullWidth && "w-full", className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <>
        <LoaderCircle aria-hidden="true" className="animate-spin" />
        {loadingText ?? children}
      </>
    ) : (
      children
    )}
  </Button>
)

export { AppButton }
export type { AppButtonProps }
