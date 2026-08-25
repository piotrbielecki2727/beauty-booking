"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { Input } from "@/components/reusable";

import type { ChangeEvent } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { InputProperties } from "@/components/reusable";

type InputControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
  formatValue?: (value: string) => string;
} & Omit<
    InputProperties,
    | "defaultValue"
    | "error"
    | "name"
    | "onBlur"
    | "onChange"
    | "onClear"
    | "value"
  >;

export const InputControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  formatValue,
  name,
  rules,
  shouldUnregister,
  ...inputProperties
}: InputControlProperties<TFieldValues, TName>) => {
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
    const nextValue = formatValue
      ? formatValue(event.target.value)
      : event.target.value;

    onChange(nextValue);
  };

  return (
    <Input
      {...inputProperties}
      ref={ref}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={inputProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onChange={handleChange}
      onClear={() => onChange("")}
      value={value ?? ""}
    />
  );
};

export type { InputControlProperties };
