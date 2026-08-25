"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { Select } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { SelectProperties } from "@/components/reusable";

type SelectControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    SelectProperties,
    "error" | "name" | "onBlur" | "onValueChange" | "value"
  >;

export const SelectControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...selectProperties
}: SelectControlProperties<TFieldValues, TName>) => {
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
    <Select
      {...selectProperties}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={selectProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export type { SelectControlProperties };
