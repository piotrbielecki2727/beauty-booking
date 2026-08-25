"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { Switch } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { SwitchProperties } from "@/components/reusable";

type SwitchControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    SwitchProperties,
    "checked" | "defaultChecked" | "error" | "name" | "onCheckedChange"
  >;

export const SwitchControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  name,
  rules,
  shouldUnregister,
  ...switchProperties
}: SwitchControlProperties<TFieldValues, TName>) => {
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
    <Switch
      {...switchProperties}
      checked={Boolean(value)}
      error={errorMessage}
      name={fieldName}
      onBlur={onBlur}
      onCheckedChange={onChange}
    />
  );
};

export type { SwitchControlProperties };
