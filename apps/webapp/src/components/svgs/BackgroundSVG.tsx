import Image from "next/image";

import backgroundSvg from "@/components/svgs/maison_rouge_background_2k_taller_sharper.svg";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

type BackgroundSVGProperties = Omit<
  ComponentProps<typeof Image>,
  "alt" | "src"
>;

export const BackgroundSVG = ({
  className,
  sizes = "100vw",
  ...properties
}: BackgroundSVGProperties) => {
  return (
    <Image
      {...properties}
      aria-hidden="true"
      alt=""
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 size-full object-cover",
        className,
      )}
      fill
      sizes={sizes}
      src={backgroundSvg}
    />
  );
};

export type { BackgroundSVGProperties };
