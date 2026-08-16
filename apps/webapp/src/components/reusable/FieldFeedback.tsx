import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type FieldFeedbackProperties = {
  className?: string;
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  minLines?: 1 | 2;
  reserveSpace?: boolean;
};

const fieldFeedbackMinHeightClassNames: Record<
  NonNullable<FieldFeedbackProperties["minLines"]>,
  string
> = {
  1: "min-h-4",
  2: "min-h-8",
};

export const FieldFeedback = ({
  className,
  description,
  error,
  id,
  minLines = 1,
  reserveSpace = false,
}: FieldFeedbackProperties) => {
  const content = error ?? description;

  if (!content && !reserveSpace) {
    return null;
  }

  return (
    <p
      aria-hidden={!content}
      className={cn(
        fieldFeedbackMinHeightClassNames[minLines],
        "text-xs leading-4",
        error ? "text-destructive" : "text-muted-foreground",
        !content && "text-transparent",
        className,
      )}
      id={id}
      role={error ? "alert" : undefined}
    >
      {content ?? "No message"}
    </p>
  );
};

export type { FieldFeedbackProperties };
