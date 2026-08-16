"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type DropdownMenuOption = {
  description?: ReactNode;
  isDisabled?: boolean;
  label: ReactNode;
  value: string;
};

type DropdownMenuBaseProperties = {
  align?: ComponentProps<typeof DropdownMenuContent>["align"];
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  isDisabled?: boolean;
  isHoverable?: boolean;
  isOpen?: boolean;
  onBlur?: () => void;
  onIsOpenChange?: (isOpen: boolean) => void;
  sideOffset?: ComponentProps<typeof DropdownMenuContent>["sideOffset"];
};

type DropdownMenuSelectionProperties = DropdownMenuBaseProperties & {
  children?: never;
  onValueChange: (value: string) => void;
  options: DropdownMenuOption[];
  placeholder?: ReactNode;
  trigger?: never;
  value: string;
};

type DropdownMenuCustomProperties = DropdownMenuBaseProperties & {
  children: ReactNode;
  onValueChange?: never;
  options?: never;
  placeholder?: never;
  trigger: ReactNode | ((isOpen: boolean) => ReactNode);
  value?: never;
};

type DropdownMenuProperties =
  | DropdownMenuCustomProperties
  | DropdownMenuSelectionProperties;

const dropdownMenuCloseDelay = 120;

export const DropdownMenu = (properties: DropdownMenuProperties) => {
  const t = useTranslations();
  const closeTimeoutRef = useRef<number | undefined>(undefined);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = properties.isOpen ?? internalIsOpen;
  const isSelectionDropdown = properties.options !== undefined;
  const selectedOption =
    isSelectionDropdown
      ? properties.options.find((option) => option.value === properties.value)
      : undefined;

  const setIsOpen = (nextIsOpen: boolean) => {
    if (properties.isOpen === undefined) {
      setInternalIsOpen(nextIsOpen);
    }

    properties.onIsOpenChange?.(nextIsOpen);
  };

  const handleValueChange = (nextValue: unknown) => {
    if (
      typeof nextValue !== "string" ||
      properties.onValueChange === undefined
    ) {
      return;
    }

    properties.onValueChange(nextValue);
    setIsOpen(false);
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== undefined) {
      window.clearTimeout(closeTimeoutRef.current);
    }
  };

  const openOnHover = () => {
    if (!properties.isHoverable) {
      return;
    }

    clearCloseTimeout();
    setIsOpen(true);
  };

  const closeOnHoverEnd = () => {
    if (!properties.isHoverable) {
      return;
    }

    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, dropdownMenuCloseDelay);
  };

  useEffect(() => clearCloseTimeout, []);

  const triggerContent =
    properties.trigger !== undefined ? (
      typeof properties.trigger === "function" ? (
        properties.trigger(isOpen)
      ) : (
        properties.trigger
      )
    ) : (
      <>
        <span className="min-w-0 truncate">
          {selectedOption?.label ??
            properties.placeholder ??
            t("common.selectPlaceholder")}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" />
        )}
      </>
    );

  const content = isSelectionDropdown ? (
    <DropdownMenuRadioGroup
      value={properties.value}
      onValueChange={handleValueChange}
    >
      {properties.options.map((option) => (
        <DropdownMenuRadioItem
          key={option.value}
          value={option.value}
          disabled={option.isDisabled}
          className={cn(
            option.value === properties.value &&
              "bg-accent text-accent-foreground",
          )}
        >
          <span className="min-w-0">
            <span className="block truncate">{option.label}</span>
            {option.description ? (
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {option.description}
              </span>
            ) : null}
          </span>
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  ) : (
    properties.children
  );

  return (
    <BaseDropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-sm",
          properties.className,
        )}
        aria-label={properties.ariaLabel}
        disabled={properties.isDisabled}
        onBlur={properties.onBlur}
        onMouseEnter={openOnHover}
        onMouseLeave={closeOnHoverEnd}
      >
        {triggerContent}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={properties.align}
        className={properties.contentClassName}
        sideOffset={properties.sideOffset}
        onMouseEnter={openOnHover}
        onMouseLeave={closeOnHoverEnd}
      >
        {content}
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
};

export type {
  DropdownMenuOption,
  DropdownMenuProperties,
  DropdownMenuSelectionProperties,
};
