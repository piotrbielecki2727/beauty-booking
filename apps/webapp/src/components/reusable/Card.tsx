import {
  Card as BaseCard,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type CardProperties = ComponentProps<typeof BaseCard> & {
  action?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  description?: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  headerClassName?: string;
  title?: ReactNode;
};

export const Card = ({
  action,
  children,
  className,
  contentClassName,
  description,
  footer,
  footerClassName,
  headerClassName,
  title,
  ...properties
}: CardProperties) => {
  const hasHeader = Boolean(title || description || action);

  return (
    <BaseCard
      className={cn(
        "min-w-0 rounded-lg border border-[var(--border-subtle,var(--border))] shadow-sm",
        "[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(5)]",
        className,
      )}
      {...properties}
    >
      {hasHeader ? (
        <CardHeader className={cn("gap-2", headerClassName)}>
          {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}

      <CardContent className={contentClassName}>{children}</CardContent>

      {footer ? (
        <CardFooter className={footerClassName}>{footer}</CardFooter>
      ) : null}
    </BaseCard>
  );
};

export type { CardProperties };
