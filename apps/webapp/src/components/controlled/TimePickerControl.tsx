"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { TimePicker } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { TimePickerProperties } from "@/components/reusable";

type TimePickerControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    TimePickerProperties,
    "defaultValue" | "error" | "name" | "onBlur" | "onValueChange" | "value"
  >;

export const TimePickerControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...timePickerProperties
}: TimePickerControlProperties<TFieldValues, TName>) => {
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
    <TimePicker
      {...timePickerProperties}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={timePickerProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export type { TimePickerControlProperties };
