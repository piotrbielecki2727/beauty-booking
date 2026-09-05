"use client";

import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { ComponentProps, ReactElement, ReactNode } from "react";

type TooltipContentProperties = ComponentProps<typeof TooltipContent>;

type TooltipProperties = {
  children: ReactElement;
  content: ReactNode;
  align?: TooltipContentProperties["align"];
  alignOffset?: TooltipContentProperties["alignOffset"];
  className?: string;
  closeDelay?: ComponentProps<typeof TooltipTrigger>["closeDelay"];
  contentClassName?: string;
  delay?: ComponentProps<typeof TooltipTrigger>["delay"];
  disabled?: boolean;
  side?: TooltipContentProperties["side"];
  sideOffset?: TooltipContentProperties["sideOffset"];
  shouldKeepTriggerWhenDisabled?: boolean;
};

export const Tooltip = ({
  children,
  content,
  align,
  alignOffset,
  className,
  closeDelay,
  contentClassName,
  delay,
  disabled = false,
  side,
  sideOffset,
  shouldKeepTriggerWhenDisabled = false,
}: TooltipProperties) => {
  if (disabled && !shouldKeepTriggerWhenDisabled) {
    return children;
  }

  return (
    <TooltipRoot>
      <TooltipTrigger
        className={className}
        closeDelay={closeDelay}
        delay={delay}
        render={children}
      />
      {disabled ? null : (
        <TooltipContent
          align={align}
          alignOffset={alignOffset}
          className={contentClassName}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
        </TooltipContent>
      )}
    </TooltipRoot>
  );
};
