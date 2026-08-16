"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { Checkbox } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { CheckboxProperties } from "@/components/reusable";

type CheckboxControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    CheckboxProperties,
    "checked" | "defaultChecked" | "error" | "name" | "onCheckedChange"
  >;

export const CheckboxControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...checkboxProperties
}: CheckboxControlProperties<TFieldValues, TName>) => {
  const {
    field: { name: fieldName, onBlur, onChange, value },
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
    <Checkbox
      {...checkboxProperties}
      checked={Boolean(value)}
      error={errorMessage}
      feedbackMode={feedbackMode}
      name={fieldName}
      onBlur={onBlur}
      onCheckedChange={(checked) => onChange(checked === true)}
    />
  );
};

export type { CheckboxControlProperties };
