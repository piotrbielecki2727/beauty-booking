"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { SegmentedControl } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { SegmentedControlProperties } from "@/components/reusable";

type SegmentedControlControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    SegmentedControlProperties,
    "error" | "name" | "onBlur" | "onValueChange" | "value"
  >;

export const SegmentedControlControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...segmentedControlProperties
}: SegmentedControlControlProperties<TFieldValues, TName>) => {
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
    <SegmentedControl
      {...segmentedControlProperties}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={segmentedControlProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      value={typeof value === "string" ? value : ""}
    />
  );
};

export type { SegmentedControlControlProperties };
