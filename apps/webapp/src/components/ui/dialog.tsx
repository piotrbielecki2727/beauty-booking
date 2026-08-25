"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const Dialog = ({ ...properties }: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot="dialog" {...properties} />;
};

const DialogTrigger = ({ ...properties }: DialogPrimitive.Trigger.Props) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...properties} />;
};

const DialogPortal = ({ ...properties }: DialogPrimitive.Portal.Props) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...properties} />;
};

const DialogClose = ({ ...properties }: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...properties} />;
};

const DialogOverlay = ({
  className,
  ...properties
}: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-foreground/25 duration-100 supports-backdrop-filter:backdrop-blur-sm",
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...properties}
    />
  );
};

type DialogContentProperties = DialogPrimitive.Popup.Props & {
  overlayVariant?: "default" | "strong";
  showCloseButton?: boolean;
};

const DialogContent = ({
  children,
  className,
  overlayVariant = "default",
  showCloseButton = true,
  ...properties
}: DialogContentProperties) => {
  const t = useTranslations();

  return (
    <DialogPortal>
      <DialogOverlay
        className={
          overlayVariant === "strong"
            ? "bg-foreground/45 supports-backdrop-filter:backdrop-blur-md"
            : undefined
        }
      />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-md bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-border outline-none duration-100 sm:max-w-md",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...properties}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                className="absolute right-4 top-4"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <XIcon />
            <span className="sr-only">{t("common.close")}</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...properties }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...properties}
    />
  );
};

const DialogFooter = ({ className, ...properties }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...properties}
    />
  );
};

const DialogTitle = ({
  className,
  ...properties
}: DialogPrimitive.Title.Props) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-brand text-lg font-semibold leading-6", className)}
      {...properties}
    />
  );
};

const DialogDescription = ({
  className,
  ...properties
}: DialogPrimitive.Description.Props) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm leading-6 text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...properties}
    />
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
