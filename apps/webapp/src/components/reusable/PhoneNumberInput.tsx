"use client";

import { forwardRef } from "react";

import { Input } from "@/components/reusable/Input";
import { cn } from "@/lib/utils";

import type { InputProperties } from "@/components/reusable/Input";

type PhoneNumberInputProperties = Omit<
  InputProperties,
  "icon" | "isSearch" | "type"
> & {
  countryCode?: string;
};

export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  PhoneNumberInputProperties
>(
  (
    {
      autoComplete = "tel-national",
      countryCode = "+48",
      inputClassName,
      inputMode = "numeric",
      maxLength = 9,
      ...properties
    },
    ref,
  ) => {
    return (
      <Input
        {...properties}
        ref={ref}
        autoComplete={autoComplete}
        icon={
          <span className="border-r border-border pr-2 text-sm font-medium text-muted-foreground">
            {countryCode}
          </span>
        }
        inputClassName={cn(inputClassName, "pl-12" )}
        inputMode={inputMode}
        maxLength={maxLength}
        type="tel"
      />
    );
  },
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export type { PhoneNumberInputProperties };
