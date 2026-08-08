"use client";

import { ArrowRightIcon } from "lucide-react";

export const CustomerFooterNewsletter = ({
  buttonLabel,
  description,
  inputLabel,
  placeholder,
  title,
}: {
  buttonLabel: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  title: string;
}) => {
  return (
    <section className="min-w-0 text-center md:text-left lg:border-l lg:border-border lg:pl-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-72 text-sm leading-6 text-muted-foreground md:mx-0">
        {description}
      </p>

      <form
        className="mx-auto mt-5 flex max-w-80 overflow-hidden rounded-md border border-input bg-card md:mx-0"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="customer-footer-newsletter">
          {inputLabel}
        </label>
        <input
          id="customer-footer-newsletter"
          type="email"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="inline-flex w-14 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={buttonLabel}
        >
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};
