"use client";

import { useCallback, useRef, useState } from "react";

import { Tooltip } from "@/components/reusable/Tooltip";
import { cn } from "@/lib/utils";

import type {
  ComponentProps,
  FocusEvent,
  PointerEvent,
  ReactNode,
} from "react";

type TruncatedTextTooltipProperties = Omit<ComponentProps<"span">, "content"> & {
  content?: ReactNode;
  contentClassName?: string;
  tooltipSide?: ComponentProps<typeof Tooltip>["side"];
};

export const TruncatedTextTooltip = ({
  children,
  className,
  content,
  contentClassName,
  tooltipSide,
  onFocus,
  onPointerEnter,
  ...properties
}: TruncatedTextTooltipProperties) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const updateIsTruncated = useCallback(() => {
    const textElement = textRef.current;

    setIsTruncated(
      Boolean(textElement && textElement.scrollWidth > textElement.clientWidth),
    );
  }, []);

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    updateIsTruncated();
    onFocus?.(event);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    updateIsTruncated();
    onPointerEnter?.(event);
  };

  return (
    <Tooltip
      content={content ?? children}
      contentClassName={contentClassName}
      disabled={!isTruncated}
      shouldKeepTriggerWhenDisabled
      side={tooltipSide}
    >
      <span
        {...properties}
        ref={textRef}
        className={cn("block min-w-0 truncate", className)}
        onFocus={handleFocus}
        onPointerEnter={handlePointerEnter}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export type { TruncatedTextTooltipProperties };
