"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const DropdownMenu = ({ ...properties }: MenuPrimitive.Root.Props) => {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...properties} />;
};

const DropdownMenuPortal = ({ ...properties }: MenuPrimitive.Portal.Props) => {
  return (
    <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...properties} />
  );
};

const DropdownMenuTrigger = ({
  ...properties
}: MenuPrimitive.Trigger.Props) => {
  return (
    <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...properties} />
  );
};

const DropdownMenuContent = ({
  align = "start",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 4,
  ...properties
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) => {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-48 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-border outline-none duration-100",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...properties}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
};

const DropdownMenuGroup = ({ ...properties }: MenuPrimitive.Group.Props) => {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...properties} />;
};

const DropdownMenuLabel = ({
  className,
  inset,
  ...properties
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => {
  return (
    <MenuPrimitive.GroupLabel
      data-inset={inset}
      data-slot="dropdown-menu-label"
      className={cn(
        "px-3 py-2.5 text-xs text-muted-foreground data-inset:pl-9.5",
        className,
      )}
      {...properties}
    />
  );
};

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  ...properties
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) => {
  return (
    <MenuPrimitive.Item
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "data-inset:pl-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    />
  );
};

const DropdownMenuSub = ({
  ...properties
}: MenuPrimitive.SubmenuRoot.Props) => {
  return (
    <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...properties} />
  );
};

const DropdownMenuSubTrigger = ({
  children,
  className,
  inset,
  ...properties
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) => {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        "data-inset:pl-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
};

const DropdownMenuSubContent = ({
  className,
  ...properties
}: ComponentProps<typeof DropdownMenuContent>) => {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-36", className)}
      {...properties}
    />
  );
};

const DropdownMenuCheckboxItem = ({
  checked,
  children,
  className,
  inset,
  ...properties
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) => {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      data-inset={inset}
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-md py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-9.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
};

const DropdownMenuRadioGroup = ({
  ...properties
}: MenuPrimitive.RadioGroup.Props) => {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...properties}
    />
  );
};

const DropdownMenuRadioItem = ({
  children,
  className,
  inset,
  ...properties
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) => {
  return (
    <MenuPrimitive.RadioItem
      data-inset={inset}
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-md py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-9.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...properties}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
};

const DropdownMenuSeparator = ({
  className,
  ...properties
}: MenuPrimitive.Separator.Props) => {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...properties}
    />
  );
};

const DropdownMenuShortcut = ({
  className,
  ...properties
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className,
      )}
      {...properties}
    />
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
