"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { Textarea } from "@/components/reusable";

import type { ChangeEvent } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import type { TextareaProperties } from "@/components/reusable";

type TextareaControlProperties<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "control"> & {
  control?: Control<TFieldValues>;
} & Omit<
    TextareaProperties,
    "defaultValue" | "error" | "name" | "onBlur" | "onChange" | "value"
  >;

export const TextareaControl = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  feedbackMode = "reserved",
  name,
  rules,
  shouldUnregister,
  ...textareaProperties
}: TextareaControlProperties<TFieldValues, TName>) => {
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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <Textarea
      {...textareaProperties}
      ref={ref}
      error={errorMessage}
      feedbackMode={feedbackMode}
      id={textareaProperties.id ?? fieldName}
      name={fieldName}
      onBlur={onBlur}
      onChange={handleChange}
      value={value ?? ""}
    />
  );
};

export type { TextareaControlProperties };
