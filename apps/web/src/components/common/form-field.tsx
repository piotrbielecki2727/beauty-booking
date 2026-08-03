"use client"

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FieldControlProps = {
  id?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "false" | "true"
  required?: boolean
}

type FormFieldProps = {
  children: ReactNode
  className?: string
  description?: ReactNode
  error?: ReactNode
  id?: string
  label: ReactNode
  reserveMessageSpace?: boolean
  required?: boolean
}

const isFieldControl = (children: ReactNode): children is ReactElement<FieldControlProps> => isValidElement(children)

const FormField = ({
  children,
  className,
  description,
  error,
  id,
  label,
  reserveMessageSpace = false,
  required = false,
}: FormFieldProps) => {
  const generatedId = useId()
  const controlId = id ?? (isFieldControl(children) ? children.props.id : undefined) ?? generatedId
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

  const control = isFieldControl(children)
    ? cloneElement(children, {
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : children.props["aria-invalid"],
        required: children.props.required ?? required,
      })
    : children

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={controlId}>
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {control}
      {error || reserveMessageSpace ? (
        <p
          id={errorId}
          className={cn("min-h-5 text-xs font-medium leading-5 text-destructive", !error && "text-transparent")}
          aria-hidden={!error}
          role={error ? "alert" : undefined}
        >
          {error ?? "Brak błędu"}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
