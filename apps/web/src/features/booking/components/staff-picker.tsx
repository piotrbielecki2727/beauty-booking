"use client"

import { Check, Sparkles, UserRound } from "lucide-react"

import { AppButton } from "@/components/common/app-button"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LoadingState } from "@/components/common/loading-state"
import { Badge } from "@/components/ui/badge"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import { cn } from "@/lib/utils"

type StaffPickerProps = {
  className?: string
  errorMessage?: string
  isError?: boolean
  isLoading?: boolean
  onRetry?: () => void
  onStaffSelect: (staffMemberId: string) => void
  selectedStaffMemberId?: string
  staffMembers: BookingStaffMember[]
}

const formatHandledServicesCount = (count: number) => {
  return count === 1 ? "1 usługa" : `${count} usługi`
}

const StaffPicker = ({
  className,
  errorMessage,
  isError = false,
  isLoading = false,
  onRetry,
  onStaffSelect,
  selectedStaffMemberId,
  staffMembers,
}: StaffPickerProps) => {
  if (isLoading) {
    return <LoadingState className={className} message="Ładowanie pracowników" variant="skeleton" />
  }

  if (isError) {
    return (
      <ErrorState
        className={className}
        description={errorMessage ?? "Nie udało się pobrać listy pracowników."}
        retryAction={
          onRetry ? (
            <AppButton onClick={onRetry} size="sm" variant="outline">
              Spróbuj ponownie
            </AppButton>
          ) : undefined
        }
        title="Nie udało się wyświetlić pracowników"
      />
    )
  }

  if (staffMembers.length === 0) {
    return (
      <EmptyState
        className={className}
        description="Dla wybranej usługi nie ma jeszcze przypisanego pracownika."
        icon={<UserRound aria-hidden="true" />}
        title="Brak dostępnych pracowników"
      />
    )
  }

  return (
    <div className={cn("grid gap-3", className)} role="radiogroup" aria-label="Wybór pracownika">
      {staffMembers.map((staffMember) => {
        const isSelected = staffMember.id === selectedStaffMemberId

        return (
          <button
            aria-checked={isSelected}
            className={cn(
              "grid w-full cursor-pointer gap-3 rounded-lg border bg-card p-4 text-left text-card-foreground transition-colors hover:border-primary/45 hover:bg-accent/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border"
            )}
            key={staffMember.id}
            onClick={() => onStaffSelect(staffMember.id)}
            role="radio"
            type="button"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="flex min-w-0 gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <UserRound aria-hidden="true" className="size-5" />
                </span>
                <span className="grid gap-1">
                  <span className="font-heading text-lg font-medium leading-snug">{staffMember.name}</span>
                  <span className="text-sm font-medium text-muted-foreground">{staffMember.role}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{staffMember.bio}</span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-transparent"
                )}
              >
                <Check className="size-4" />
              </span>
            </span>

            <span className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                <Sparkles aria-hidden="true" />
                {formatHandledServicesCount(staffMember.serviceIds.length)}
              </Badge>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { StaffPicker }
export type { StaffPickerProps }
