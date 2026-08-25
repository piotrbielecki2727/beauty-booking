"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverPortal = PopoverPrimitive.Portal

const PopoverPositioner = ({
  align = "start",
  className,
  sideOffset = 6,
  ...props
}: PopoverPrimitive.Positioner.Props) => (
  <PopoverPrimitive.Positioner
    align={align}
    className={cn("isolate z-50", className)}
    sideOffset={sideOffset}
    {...props}
  />
)

type PopoverContentProperties = PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  >;

const PopoverContent = ({
  align,
  alignOffset,
  anchor,
  className,
  side,
  sideOffset,
  ...props
}: PopoverContentProperties) => (
  <PopoverPortal>
    <PopoverPositioner
      align={align}
      alignOffset={alignOffset}
      anchor={anchor}
      side={side}
      sideOffset={sideOffset}
    >
      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={cn(
          "grid w-80 gap-4 rounded-lg border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPositioner>
  </PopoverPortal>
)

export { Popover, PopoverContent, PopoverPortal, PopoverPositioner, PopoverTrigger }
