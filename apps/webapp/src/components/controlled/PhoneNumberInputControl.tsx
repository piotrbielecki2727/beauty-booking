"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { PhoneNumberInput } from "@/components/reusable";

import type { ChangeEvent } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { PhoneNumberInputProperties } from "@/components/reusable";

const normalizePhoneNumberInput = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 9);
};

type PhoneNumberInputControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
  formatValue?: (value: string) => string;
} & Omit<
    PhoneNumberInputProperties,
    | "defaultValue"
    | "error"
    | "name"
    | "onBlur"
    | "onChange"
    | "onClear"
    | "value"
  >;

export const PhoneNumberInputControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  formatValue = normalizePhoneNumberInput,
  name,
  rules,
  shouldUnregister,
  ...inputProperties
}: PhoneNumberInputControlProperties<TFieldValues, TName>) => {
  const {
    field: {
      name: fieldName,
      onBlur,
      onChange,
      ref,
      value,
    },
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister,
  });
  const errorMessage = useTranslatedFieldError(error?.message);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(formatValue(event.target.value));
  };

  return (
    <PhoneNumberInput
      {...inputProperties}
      ref={ref}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={inputProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onChange={handleChange}
      onClear={() => onChange("")}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export { normalizePhoneNumberInput };
export type { PhoneNumberInputControlProperties };
