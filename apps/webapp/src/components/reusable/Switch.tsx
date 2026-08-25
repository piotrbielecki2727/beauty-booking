"use client";

import { useId } from "react";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Label } from "@/components/ui/label";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type SwitchProperties = Omit<
  ComponentProps<typeof BaseSwitch>,
  "disabled" | "required"
> & {
  containerClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  label: ReactNode;
};

export const Switch = ({
  className,
  containerClassName,
  description,
  error,
  id,
  isDisabled = false,
  isRequired = false,
  label,
  ...properties
}: SwitchProperties) => {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const feedbackId = error || description ? `${switchId}-feedback` : undefined;

  return (
    <div className={cn("grid gap-1.5", containerClassName)}>
      <div className="flex items-center gap-3">
        <BaseSwitch
          {...properties}
          aria-describedby={feedbackId}
          className={className}
          disabled={isDisabled}
          id={switchId}
          required={isRequired}
        />
        <Label className="text-sm leading-5" htmlFor={switchId}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          ) : null}
        </Label>
      </div>
      <FieldFeedback
        className="pl-14"
        description={description}
        error={error}
        id={feedbackId}
      />
    </div>
  );
};

export type { SwitchProperties };
