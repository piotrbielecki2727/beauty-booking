"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

const Switch = ({ className, ...properties }: SwitchPrimitive.Root.Props) => (
  <SwitchPrimitive.Root
    className={cn(
      "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-[color-mix(in_srgb,var(--line-strong)_22%,var(--surface))] p-0.5 shadow-inner transition-colors outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-[var(--ring-soft)] data-checked:border-brand data-checked:bg-brand disabled:cursor-default disabled:opacity-50",
      className,
    )}
    {...properties}
  >
    <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-surface-raised shadow-sm transition-transform data-checked:translate-x-5 data-checked:bg-background" />
  </SwitchPrimitive.Root>
);

export { Switch };
