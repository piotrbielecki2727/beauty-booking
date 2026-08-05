"use client"

import type { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type AppTabItem<TValue extends string> = {
  content: ReactNode
  disabled?: boolean
  label: ReactNode
  value: TValue
}

type AppTabsProps<TValue extends string> = {
  className?: string
  contentClassName?: string
  items: AppTabItem<TValue>[]
  listClassName?: string
  onValueChange: (value: TValue) => void
  value: TValue
}

const AppTabs = <TValue extends string>({
  className,
  contentClassName,
  items,
  listClassName,
  onValueChange,
  value,
}: AppTabsProps<TValue>) => (
  <Tabs
    className={cn("gap-5", className)}
    onValueChange={(nextValue) => onValueChange(nextValue as TValue)}
    value={value}
  >
    <TabsList
      className={cn(
        "!grid !h-auto w-full grid-cols-1 gap-2 rounded-lg border border-border/70 bg-card p-1.5 text-foreground sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]",
        listClassName
      )}
    >
      {items.map((item) => (
        <TabsTrigger
          className="!h-11 w-full rounded-md border-border/70 px-4 text-base font-medium after:hidden hover:bg-primary/10 hover:text-primary data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary/90"
          disabled={item.disabled}
          key={item.value}
          value={item.value}
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>

    {items.map((item) => (
      <TabsContent className={cn("outline-none", contentClassName)} key={item.value} value={item.value}>
        {item.content}
      </TabsContent>
    ))}
  </Tabs>
)

export { AppTabs }
export type { AppTabItem, AppTabsProps }
