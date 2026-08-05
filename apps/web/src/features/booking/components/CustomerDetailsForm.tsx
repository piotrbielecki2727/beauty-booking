"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import type { ControllerFieldState } from "react-hook-form"

import { FormField } from "@/components/common/form-field"
import { PhoneNumberInput } from "@/components/common/phone-number-input"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  customerDetailsSchema,
  type BookingCustomerDetails,
} from "@/features/booking/schemas/customerDetailsSchema"
import { normalizeNameInput, normalizePhoneInput } from "@/features/booking/utils/customerDetailsFormatters"

type CustomerDetailsChangeHandler = (details: BookingCustomerDetails) => void

type CustomerDetailsFormProps = {
  details: BookingCustomerDetails
  onDetailsChange: CustomerDetailsChangeHandler
}

const getVisibleFieldError = (fieldState: ControllerFieldState) =>
  fieldState.isTouched ? fieldState.error?.message : undefined

const areCustomerDetailsEqual = (firstDetails: BookingCustomerDetails, secondDetails: BookingCustomerDetails) =>
  firstDetails.email === secondDetails.email &&
  firstDetails.firstName === secondDetails.firstName &&
  firstDetails.lastName === secondDetails.lastName &&
  firstDetails.note === secondDetails.note &&
  firstDetails.phone === secondDetails.phone

const CustomerDetailsForm = ({ details, onDetailsChange }: CustomerDetailsFormProps) => {
  const form = useForm<BookingCustomerDetails>({
    defaultValues: details,
    mode: "onChange",
    resolver: zodResolver(customerDetailsSchema),
  })

  const firstName = useWatch({ control: form.control, name: "firstName" })
  const lastName = useWatch({ control: form.control, name: "lastName" })
  const phone = useWatch({ control: form.control, name: "phone" })
  const email = useWatch({ control: form.control, name: "email" })
  const note = useWatch({ control: form.control, name: "note" })

  useEffect(() => {
    const nextDetails = {
      email,
      firstName,
      lastName,
      note,
      phone,
    }

    if (!areCustomerDetailsEqual(nextDetails, details)) {
      onDetailsChange(nextDetails)
    }
  }, [details, email, firstName, lastName, note, onDetailsChange, phone])

  return (
    <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormField
              error={getVisibleFieldError(fieldState)}
              label="Imię"
              reserveMessageSpace
              required
            >
              <Input
                autoComplete="given-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizeNameInput(event.target.value))}
                placeholder="Anna"
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <FormField
              error={getVisibleFieldError(fieldState)}
              label="Nazwisko"
              reserveMessageSpace
              required
            >
              <Input
                autoComplete="family-name"
                maxLength={40}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizeNameInput(event.target.value))}
                placeholder="Kowalska"
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormField
              error={getVisibleFieldError(fieldState)}
              label="Telefon"
              reserveMessageSpace
              required
            >
              <PhoneNumberInput
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={9}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(normalizePhoneInput(event.target.value))}
                placeholder="500000000"
                ref={field.ref}
                value={field.value}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField error={getVisibleFieldError(fieldState)} label="E-mail" reserveMessageSpace>
              <Input
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="anna@example.com"
                ref={field.ref}
                type="email"
                value={field.value}
              />
            </FormField>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="note"
        render={({ field, fieldState }) => (
          <FormField
            description="Np. preferencje, alergie albo krótka informacja przed wizytą."
            error={getVisibleFieldError(fieldState)}
            label="Notatka"
          >
            <Textarea
              maxLength={500}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Chcę delikatny efekt, bez mocnego błysku."
              ref={field.ref}
              value={field.value}
            />
          </FormField>
        )}
      />
    </form>
  )
}

export { CustomerDetailsForm }
export type { CustomerDetailsFormProps }
