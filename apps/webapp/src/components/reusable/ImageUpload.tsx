"use client";

import { ImageIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";

import { Button } from "@/components/reusable/Button";
import { FieldFeedback } from "@/components/reusable/FieldFeedback";
import { cn } from "@/lib/utils";

import type { ChangeEvent, DragEvent, ReactNode } from "react";

type ImageUploadValidationErrorCode =
  | "dimensionsTooLarge"
  | "dimensionsTooSmall"
  | "fileTooLarge"
  | "imageUnreadable"
  | "unsupportedType";

type ImageUploadValidationMessages = Record<
  ImageUploadValidationErrorCode,
  string
>;

type ImageUploadProperties = {
  accept?: readonly string[];
  className?: string;
  dropLabel: ReactNode;
  helperText?: ReactNode;
  id?: string;
  isDisabled?: boolean;
  maxFileSizeMb: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  onChange: (file: File | null) => void;
  previewAlt: string;
  previewLabel: ReactNode;
  removeLabel: string;
  validationMessages: ImageUploadValidationMessages;
  value: File | null;
};

const getImageDimensions = (file: File) =>
  new Promise<{ height: number; width: number }>((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ height: image.naturalHeight, width: image.naturalWidth });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      reject(new Error("Image could not be read"));
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });

export const ImageUpload = ({
  accept = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
  className,
  dropLabel,
  helperText,
  id,
  isDisabled = false,
  maxFileSizeMb,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  onChange,
  previewAlt,
  previewLabel,
  removeLabel,
  validationMessages,
  value,
}: ImageUploadProperties) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [errorCode, setErrorCode] =
    useState<ImageUploadValidationErrorCode>();
  const [isDragging, setIsDragging] = useState(false);
  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : undefined),
    [value],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSelect = async (file: File) => {
    setErrorCode(undefined);

    if (!accept.includes(file.type)) {
      setErrorCode("unsupportedType");
      return;
    }

    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setErrorCode("fileTooLarge");
      return;
    }

    try {
      const { height, width } = await getImageDimensions(file);
      const isTooSmall =
        (minWidth !== undefined && width < minWidth) ||
        (minHeight !== undefined && height < minHeight);
      const isTooLarge =
        (maxWidth !== undefined && width > maxWidth) ||
        (maxHeight !== undefined && height > maxHeight);

      if (isTooSmall) {
        setErrorCode("dimensionsTooSmall");
        return;
      }

      if (isTooLarge) {
        setErrorCode("dimensionsTooLarge");
        return;
      }

      onChange(file);
    } catch {
      setErrorCode("imageUnreadable");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      void validateAndSelect(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isDisabled) {
      return;
    }

    const file = event.dataTransfer.files[0];

    if (file) {
      void validateAndSelect(file);
    }
  };

  const handleRemove = () => {
    setErrorCode(undefined);
    onChange(null);
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
      <div
        className={cn(
          "grid min-h-32 gap-4 rounded-lg border border-dashed border-line-strong bg-background p-4 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
          !isDisabled && "hover:border-brand hover:bg-surface-soft",
          isDragging && "border-brand bg-brand-soft",
          isDisabled && "cursor-default opacity-50",
          errorCode && "border-destructive",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isDisabled) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget;

          if (
            !(nextTarget instanceof Node) ||
            !event.currentTarget.contains(nextTarget)
          ) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <label
          className={cn(
            "flex min-w-0 items-center gap-4",
            !isDisabled && "cursor-pointer",
          )}
          htmlFor={inputId}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <UploadCloudIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="text-sm font-medium text-copy">{dropLabel}</span>
            {helperText ? (
              <span className="text-xs leading-4 text-copy-muted">
                {helperText}
              </span>
            ) : null}
          </span>
          <input
            accept={accept.join(",")}
            className="sr-only"
            disabled={isDisabled}
            id={inputId}
            onChange={handleChange}
            type="file"
          />
        </label>

        <div className="flex min-h-20 min-w-44 items-center gap-3 rounded-lg border border-line bg-card p-3">
          {previewUrl ? (
            <Image
              alt={previewAlt}
              className="size-12 rounded-full border border-line bg-surface object-cover"
              height={48}
              src={previewUrl}
              unoptimized
              width={48}
            />
          ) : (
            <span className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-copy-muted">
              <ImageIcon className="size-5" aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-sm text-copy-muted">
            {value?.name ?? previewLabel}
          </span>
          {value ? (
            <Button
              aria-label={removeLabel}
              className="shrink-0 text-copy-muted hover:text-destructive"
              isDisabled={isDisabled}
              onClick={handleRemove}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Trash2Icon className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>

      <FieldFeedback
        error={errorCode ? validationMessages[errorCode] : undefined}
      />
    </div>
  );
};

export type {
  ImageUploadProperties,
  ImageUploadValidationErrorCode,
  ImageUploadValidationMessages,
};
