"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, type ReactNode } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type AppDropdownOption = {
  description?: ReactNode
  disabled?: boolean
  label: ReactNode
  value: string
}

type AppDropdownProps = {
  className?: string
  contentClassName?: string
  disabled?: boolean
  onValueChange: (value: string) => void
  options: AppDropdownOption[]
  placeholder?: ReactNode
  value: string
}

const AppDropdown = ({
  className,
  contentClassName,
  disabled = false,
  onValueChange,
  options,
  placeholder = "Wybierz",
  value,
}: AppDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-3xl border border-border/70 bg-input/45 px-3 text-left text-sm font-medium outline-none transition-colors hover:border-primary/35 focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-default disabled:opacity-50",
          className
        )}
        disabled={disabled}
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? placeholder}</span>
        {isOpen ? (
          <ChevronUp aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("min-w-(--anchor-width)", contentClassName)} sideOffset={6}>
        <DropdownMenuRadioGroup
          onValueChange={(nextValue) => {
            onValueChange(String(nextValue))
            setIsOpen(false)
          }}
          value={value}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              className={cn(
                option.value === value &&
                  "bg-primary/10 text-primary focus:bg-primary/12 focus:text-primary"
              )}
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              <span className="grid min-w-0 gap-0.5">
                <span className="min-w-0 truncate">{option.label}</span>
                {option.description ? (
                  <span className="text-xs font-normal leading-5 text-muted-foreground">{option.description}</span>
                ) : null}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AppDropdown }
export type { AppDropdownOption, AppDropdownProps }
