"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Select = SelectPrimitive.Root;

const SelectGroup = ({
  className,
  ...properties
}: SelectPrimitive.Group.Props) => {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1.5 p-1.5", className)}
      {...properties}
    />
  );
};

const SelectValue = ({
  className,
  ...properties
}: SelectPrimitive.Value.Props) => {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...properties}
    />
  );
};

type SelectTriggerProperties = SelectPrimitive.Trigger.Props & {
  size?: "default" | "sm";
};

const SelectTrigger = ({
  children,
  className,
  size = "default",
  ...properties
}: SelectTriggerProperties) => {
  return (
    <SelectPrimitive.Trigger
      data-size={size}
      data-slot="select-trigger"
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-colors outline-none",
        "hover:bg-muted/50",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-placeholder:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-8",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  );
};

type SelectContentProperties = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
  > & {
    isPortaled?: boolean;
  };

const SelectContent = ({
  align = "center",
  alignItemWithTrigger = true,
  alignOffset = 0,
  children,
  className,
  isPortaled = true,
  side = "bottom",
  sideOffset = 4,
  ...properties
}: SelectContentProperties) => {
  const content = (
    <SelectPrimitive.Positioner
      align={align}
      alignItemWithTrigger={alignItemWithTrigger}
      alignOffset={alignOffset}
      className="isolate z-50"
      side={side}
      sideOffset={sideOffset}
    >
      <SelectPrimitive.Popup
        data-align-trigger={alignItemWithTrigger}
        data-slot="select-content"
        className={cn(
          "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-border outline-none duration-100",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          "data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...properties}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.List>{children}</SelectPrimitive.List>
        <SelectScrollDownButton />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  );

  if (!isPortaled) {
    return content;
  }

  return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>;
};

const SelectLabel = ({
  className,
  ...properties
}: SelectPrimitive.GroupLabel.Props) => {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
      {...properties}
    />
  );
};

const SelectItem = ({
  children,
  className,
  ...properties
}: SelectPrimitive.Item.Props) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2.5 rounded-md py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "data-selected:bg-primary data-selected:text-primary-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...properties}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

const SelectSeparator = ({
  className,
  ...properties
}: SelectPrimitive.Separator.Props) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1.5 my-1.5 h-px bg-border", className)}
      {...properties}
    />
  );
};

const SelectScrollUpButton = ({
  className,
  ...properties
}: ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) => {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
};

const SelectScrollDownButton = ({
  className,
  ...properties
}: ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) => {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
};

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
