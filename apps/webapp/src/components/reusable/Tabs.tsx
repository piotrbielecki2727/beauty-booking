"use client";

import {
  Tabs as BaseTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type TabItem<Value extends string = string> = {
  content: ReactNode;
  isDisabled?: boolean;
  label: ReactNode;
  value: Value;
};

type TabsProperties<Value extends string = string> = {
  ariaLabel: string;
  className?: string;
  contentClassName?: string;
  defaultValue?: Value;
  items: readonly TabItem<Value>[];
  listClassName?: string;
  onValueChange?: (value: Value) => void;
  value?: Value;
  variant?: "default" | "line";
};

export const Tabs = <Value extends string = string>({
  ariaLabel,
  className,
  contentClassName,
  defaultValue,
  items,
  listClassName,
  onValueChange,
  value,
  variant = "line",
}: TabsProperties<Value>) => (
  <BaseTabs
    className={cn("min-w-0 gap-6", className)}
    defaultValue={defaultValue ?? items[0]?.value}
    onValueChange={(nextValue) => onValueChange?.(nextValue as Value)}
    value={value}
  >
    <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabsList
        aria-label={ariaLabel}
        className={cn(
          "h-11 min-w-max justify-start p-0",
          variant === "line" && "w-full border-b border-line",
          listClassName,
        )}
        variant={variant}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            className={cn(
              "h-11 flex-none px-4 text-copy-muted hover:text-copy data-active:text-brand",
              variant === "line" && "after:bg-brand",
            )}
            disabled={item.isDisabled}
            value={item.value}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>

    {items.map((item) => (
      <TabsContent
        key={item.value}
        className={cn("min-w-0", contentClassName)}
        value={item.value}
      >
        {item.content}
      </TabsContent>
    ))}
  </BaseTabs>
);

export type { TabItem, TabsProperties };
