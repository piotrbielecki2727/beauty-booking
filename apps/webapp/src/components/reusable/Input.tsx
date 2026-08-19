"use client";

import { forwardRef, useId, useState } from "react";
import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from "react";

type InputFeedbackMode = "auto" | "overlay" | "reserved";
type InputType = ComponentPropsWithoutRef<"input">["type"];

type InputProperties = Omit<
  ComponentPropsWithoutRef<"input">,
  "className" | "disabled" | "required" | "type"
> & {
  className?: string;
  containerClassName?: string;
  description?: ReactNode;
  error?: ReactNode;
  feedbackMinLines?: 1 | 2;
  feedbackMode?: InputFeedbackMode;
  icon?: ReactNode;
  inputClassName?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isSearch?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  onClear?: () => void;
  type?: InputType;
};

export const Input = forwardRef<HTMLInputElement, InputProperties>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      containerClassName,
      description,
      error,
      feedbackMinLines = 1,
      feedbackMode = "auto",
      icon,
      id,
      inputClassName,
      isClearable = false,
      isDisabled = false,
      isRequired = false,
      isSearch = false,
      label,
      labelClassName,
      name,
      onChange,
      onClear,
      placeholder,
      type = "text",
      value,
      ...properties
    },
    ref,
  ) => {
    const t = useTranslations();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const generatedId = useId();

    const inputId = id ?? generatedId;
    const isPassword = type === "password";
    const isFeedbackOverlay = feedbackMode === "overlay";
    const hasLeftIcon = Boolean(icon || isSearch);
    const normalizedValue =
      typeof value === "string" || typeof value === "number"
        ? String(value)
        : "";
    const isClearButtonVisible =
      isClearable && !isDisabled && !isPassword && normalizedValue.length > 0;
    const hasRightButton = isPassword || isClearButtonVisible;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId =
      error || feedbackMode === "reserved" ? `${inputId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
      undefined;

    const handleClear = () => {
      if (onClear) {
        onClear();
        return;
      }

      onChange?.({
        currentTarget: {
          name,
          value: "",
        },
        target: {
          name,
          value: "",
        },
      } as ChangeEvent<HTMLInputElement>);
    };

    return (
      <div
        className={cn(
          "grid gap-1.5",
          isFeedbackOverlay && "relative",
          containerClassName,
          className,
        )}
        data-invalid={error ? true : undefined}
      >
        {label ? (
          <Label
            className={cn("gap-1 leading-5", labelClassName)}
            htmlFor={inputId}
          >
            {label}
            {isRequired ? (
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            ) : null}
          </Label>
        ) : null}

        {description ? (
          <FieldFeedback
            className="-mt-1"
            description={description}
            id={descriptionId}
          />
        ) : null}

        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground">
              {icon}
            </span>
          ) : null}

          {isSearch && !icon ? (
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          ) : null}

          <BaseInput
            {...properties}
            ref={ref}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            disabled={isDisabled}
            id={inputId}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            required={isRequired}
            type={isPassword && isPasswordVisible ? "text" : type}
            value={value}
            className={cn(
              error && "border-destructive ring-[var(--destructive-ring,var(--destructive))]",
              hasLeftIcon && "pl-10",
              hasRightButton && "pr-10",
              inputClassName,
            )}
          />

          {isPassword ? (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={
                isPasswordVisible
                  ? t("input.hidePassword")
                  : t("input.showPassword")
              }
              aria-pressed={isPasswordVisible}
              className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              disabled={isDisabled}
              onClick={() =>
                setIsPasswordVisible(
                  (previousIsPasswordVisible) => !previousIsPasswordVisible,
                )
              }
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="size-4 text-brand" aria-hidden="true" />
              ) : (
                <EyeIcon className="size-4 text-brand" aria-hidden="true" />
              )}
            </Button>
          ) : null}

          {isClearButtonVisible ? (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={t("input.clear")}
              className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={handleClear}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        <FieldFeedback
          className={
            isFeedbackOverlay
              ? "absolute left-0 top-full z-10 mt-0.5 w-full"
              : undefined
          }
          error={error}
          id={errorId}
          minLines={feedbackMinLines}
          reserveSpace={feedbackMode === "reserved"}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export type { InputFeedbackMode, InputProperties, InputType };
