"use client"

import { Check, Clock, Scissors } from "lucide-react"

import { AppButton } from "@/components/common/app-button"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LoadingState } from "@/components/common/loading-state"
import { Badge } from "@/components/ui/badge"
import type { BeautyService } from "@/features/booking/types/service"
import {
  formatDuration,
  formatPriceFrom,
  getServiceCategoryLabel,
} from "@/features/booking/utils/service-formatters"
import { cn } from "@/lib/utils"

type ServicePickerProps = {
  className?: string
  errorMessage?: string
  isError?: boolean
  isLoading?: boolean
  onRetry?: () => void
  onServiceSelect: (serviceId: string) => void
  selectedServiceId?: string
  services: BeautyService[]
}

const ServicePicker = ({
  className,
  errorMessage,
  isError = false,
  isLoading = false,
  onRetry,
  onServiceSelect,
  selectedServiceId,
  services,
}: ServicePickerProps) => {
  if (isLoading) {
    return <LoadingState className={className} message="Ładowanie usług" variant="skeleton" />
  }

  if (isError) {
    return (
      <ErrorState
        className={className}
        description={errorMessage ?? "Nie udało się pobrać listy usług."}
        retryAction={
          onRetry ? (
            <AppButton onClick={onRetry} size="sm" variant="outline">
              Spróbuj ponownie
            </AppButton>
          ) : undefined
        }
        title="Nie udało się wyświetlić usług"
      />
    )
  }

  if (services.length === 0) {
    return (
      <EmptyState
        className={className}
        description="Po dodaniu usług klientki zobaczą je tutaj jako pierwszy krok rezerwacji."
        icon={<Scissors aria-hidden="true" />}
        title="Brak dostępnych usług"
      />
    )
  }

  return (
    <div className={cn("grid gap-3", className)} role="radiogroup" aria-label="Wybór usługi">
      {services.map((service) => {
        const isSelected = service.id === selectedServiceId

        return (
          <button
            aria-checked={isSelected}
            className={cn(
              "grid w-full cursor-pointer gap-3 rounded-lg border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors hover:border-primary/45 hover:bg-accent/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border"
            )}
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            role="radio"
            type="button"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="grid gap-1">
                <span className="font-heading text-lg font-medium leading-snug">{service.name}</span>
                <span className="text-sm leading-6 text-muted-foreground">{service.description}</span>
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

            <span className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">{getServiceCategoryLabel(service.category)}</Badge>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock aria-hidden="true" className="size-4" />
                {formatDuration(service.durationMinutes)}
              </span>
              <span className="font-medium text-foreground">{formatPriceFrom(service.priceFrom)}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { ServicePicker }
export type { ServicePickerProps }
