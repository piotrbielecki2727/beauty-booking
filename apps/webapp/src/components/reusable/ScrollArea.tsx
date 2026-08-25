"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { CSSProperties, ReactNode } from "react";

const scrollOverflowTolerancePx = 1;

type ScrollAreaProperties = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  scrollbar?: "both" | "horizontal" | "vertical";
  verticalScrollbarClassName?: string;
};

export const ScrollArea = ({
  children,
  className,
  contentClassName,
  scrollbar = "vertical",
  verticalScrollbarClassName,
}: ScrollAreaProperties) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [verticalScrollbarThumbStyle, setVerticalScrollbarThumbStyle] =
    useState<CSSProperties>();
  const [horizontalScrollbarThumbStyle, setHorizontalScrollbarThumbStyle] =
    useState<CSSProperties>();

  const updateScrollbar = useCallback(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      setVerticalScrollbarThumbStyle(undefined);
      setHorizontalScrollbarThumbStyle(undefined);
      return;
    }

    if (
      scrollbar !== "horizontal" &&
      scrollArea.scrollHeight - scrollArea.clientHeight >
        scrollOverflowTolerancePx
    ) {
      const naturalThumbHeight =
        (scrollArea.clientHeight / scrollArea.scrollHeight) * 100;
      const thumbHeight = Math.max(naturalThumbHeight, 12);
      const scrollProgress =
        scrollArea.scrollTop /
        (scrollArea.scrollHeight - scrollArea.clientHeight);

      setVerticalScrollbarThumbStyle({
        height: `${thumbHeight}%`,
        top: `${scrollProgress * (100 - thumbHeight)}%`,
      });
    } else {
      setVerticalScrollbarThumbStyle(undefined);
    }

    if (
      scrollbar !== "vertical" &&
      scrollArea.scrollWidth - scrollArea.clientWidth >
        scrollOverflowTolerancePx
    ) {
      const naturalThumbWidth =
        (scrollArea.clientWidth / scrollArea.scrollWidth) * 100;
      const thumbWidth = Math.max(naturalThumbWidth, 12);
      const scrollProgress =
        scrollArea.scrollLeft /
        (scrollArea.scrollWidth - scrollArea.clientWidth);

      setHorizontalScrollbarThumbStyle({
        left: `${scrollProgress * (100 - thumbWidth)}%`,
        width: `${thumbWidth}%`,
      });
    } else {
      setHorizontalScrollbarThumbStyle(undefined);
    }
  }, [scrollbar]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      return;
    }

    updateScrollbar();

    const resizeObserver = new ResizeObserver(updateScrollbar);

    resizeObserver.observe(scrollArea);
    if (scrollArea.firstElementChild) {
      resizeObserver.observe(scrollArea.firstElementChild);
    }

    return () => resizeObserver.disconnect();
  }, [updateScrollbar]);

  return (
    <div
      className={cn(
        "relative min-h-0 min-w-0 overflow-hidden",
        className,
      )}
    >
      <div
        ref={scrollAreaRef}
        className={cn(
          "h-full min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          contentClassName,
        )}
        onScroll={updateScrollbar}
      >
        {children}
      </div>

      {verticalScrollbarThumbStyle ? (
        <div
          aria-hidden="true"
          className={cn(
            "absolute right-0 top-0 w-1 rounded-full bg-surface-soft",
            horizontalScrollbarThumbStyle ? "bottom-2" : "bottom-0",
            verticalScrollbarClassName,
          )}
        >
          <div
            className="absolute inset-x-0 rounded-full bg-brand transition-[top,height] duration-300 ease-out motion-reduce:transition-none"
            style={verticalScrollbarThumbStyle}
          />
        </div>
      ) : null}

      {horizontalScrollbarThumbStyle ? (
        <div
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 left-0 h-1 rounded-full bg-surface-soft",
            verticalScrollbarThumbStyle ? "right-2" : "right-0",
          )}
        >
          <div
            className="absolute inset-y-0 rounded-full bg-brand transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
            style={horizontalScrollbarThumbStyle}
          />
        </div>
      ) : null}
    </div>
  );
};

export type { ScrollAreaProperties };
