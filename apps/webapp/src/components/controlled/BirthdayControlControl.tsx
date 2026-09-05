"use client";

import { useController } from "react-hook-form";

import { useTranslatedFieldError } from "@/components/controlled/useTranslatedFieldError";
import { BirthdayControl } from "@/components/reusable";

import type {
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import type { BirthdayControlProperties } from "@/components/reusable";

type BirthdayControlControlProperties<TFieldValues extends FieldValues> = Omit<
  BirthdayControlProperties,
  "error" | "onBlur" | "onValueChange" | "value"
> & {
  control?: Control<TFieldValues>;
  dayName: FieldPath<TFieldValues>;
  monthName: FieldPath<TFieldValues>;
};

export const BirthdayControlControl = <TFieldValues extends FieldValues>({
  control,
  dayName,
  monthName,
  ...controlProperties
}: BirthdayControlControlProperties<TFieldValues>) => {
  const {
    field: dayField,
    fieldState: { error: dayError },
  } = useController({
    control,
    name: dayName,
  });
  const {
    field: monthField,
    fieldState: { error: monthError },
  } = useController({
    control,
    name: monthName,
  });
  const errorMessage = useTranslatedFieldError(
    dayError?.message ?? monthError?.message,
  );

  return (
    <BirthdayControl
      {...controlProperties}
      error={errorMessage}
      onBlur={() => {
        monthField.onBlur();
        dayField.onBlur();
      }}
      onValueChange={(birthday) => {
        monthField.onChange(birthday.month);
        dayField.onChange(birthday.day);
      }}
      value={{
        day: typeof dayField.value === "string" ? dayField.value : "",
        month: typeof monthField.value === "string" ? monthField.value : "",
      }}
    />
  );
};

export type { BirthdayControlControlProperties };
