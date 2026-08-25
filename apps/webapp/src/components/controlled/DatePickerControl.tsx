"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { DatePicker } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { DatePickerProperties } from "@/components/reusable";

type DatePickerControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    DatePickerProperties,
    "error" | "name" | "onBlur" | "onValueChange" | "value"
  >;

export const DatePickerControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...datePickerProperties
}: DatePickerControlProperties<TFieldValues, TName>) => {
  const {
    field: {
      name: fieldName,
      onBlur,
      onChange,
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

  return (
    <DatePicker
      {...datePickerProperties}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={datePickerProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export type { DatePickerControlProperties };
