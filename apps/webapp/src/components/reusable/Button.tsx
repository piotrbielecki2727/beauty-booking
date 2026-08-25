"use client";

import { LoaderCircleIcon } from "lucide-react";

import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type ButtonProperties = Omit<ComponentProps<typeof BaseButton>, "disabled"> & {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: ReactNode;
};

export const Button = ({
  children,
  className,
  isDisabled = false,
  isFullWidth = false,
  isLoading = false,
  loadingText,
  ...properties
}: ButtonProperties) => {
  return (
    <BaseButton
      {...properties}
      aria-busy={isLoading || undefined}
      className={cn(isFullWidth && "w-full", className)}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? (
        <>
          <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </BaseButton>
  );
};

export type { ButtonProperties };
