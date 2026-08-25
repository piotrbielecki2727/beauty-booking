"use client";

import { useController } from "react-hook-form";

import { DropdownMenu } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { DropdownMenuSelectionProperties } from "@/components/reusable";

type DropdownMenuControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    DropdownMenuSelectionProperties,
    "children" | "onBlur" | "onValueChange" | "trigger" | "value"
  >;

export const DropdownMenuControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  name,
  rules,
  shouldUnregister,
  ...dropdownMenuProperties
}: DropdownMenuControlProperties<TFieldValues, TName>) => {
  const {
    field: { onBlur, onChange, value },
  } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister,
  });

  return (
    <DropdownMenu
      {...dropdownMenuProperties}
      onBlur={onBlur}
      onValueChange={onChange}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export type { DropdownMenuControlProperties };
