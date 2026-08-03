import type { ComponentProps, ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SectionCardProps = ComponentProps<typeof Card> & {
  action?: ReactNode
  description?: ReactNode
  title?: ReactNode
}

const SectionCard = ({
  action,
  children,
  className,
  description,
  title,
  ...props
}: SectionCardProps) => {
  const hasHeader = title || description || action

  return (
    <Card
      className={cn(
        "min-w-0 rounded-lg border border-border/70 shadow-sm ring-foreground/5",
        "[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(5)]",
        className
      )}
      {...props}
    >
      {hasHeader ? (
        <CardHeader className="gap-2">
          {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export { SectionCard }
export type { SectionCardProps }
