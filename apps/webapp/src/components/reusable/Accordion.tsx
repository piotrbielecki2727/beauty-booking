"use client";

import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

type AccordionProperties = ComponentProps<typeof BaseAccordion>;
type AccordionItemProperties = ComponentProps<typeof BaseAccordionItem>;
type AccordionTriggerProperties = ComponentProps<typeof BaseAccordionTrigger>;
type AccordionContentProperties = ComponentProps<typeof BaseAccordionContent>;

export const Accordion = ({ className, ...properties }: AccordionProperties) => (
  <BaseAccordion className={cn("gap-3", className)} {...properties} />
);

export const AccordionItem = ({
  className,
  ...properties
}: AccordionItemProperties) => (
  <BaseAccordionItem
    className={cn(
      "rounded-lg border border-line bg-surface/70 not-last:border-b",
      className,
    )}
    {...properties}
  />
);

export const AccordionTrigger = ({
  className,
  ...properties
}: AccordionTriggerProperties) => (
  <BaseAccordionTrigger
    className={cn(
      "min-h-14 px-4 py-3 text-copy hover:bg-surface-soft hover:no-underline focus-visible:border-brand focus-visible:ring-[var(--ring-soft)]",
      className,
    )}
    {...properties}
  />
);

export const AccordionContent = ({
  className,
  ...properties
}: AccordionContentProperties) => (
  <BaseAccordionContent className={cn("px-4 pb-4", className)} {...properties} />
);

export type {
  AccordionContentProperties,
  AccordionItemProperties,
  AccordionProperties,
  AccordionTriggerProperties,
};
