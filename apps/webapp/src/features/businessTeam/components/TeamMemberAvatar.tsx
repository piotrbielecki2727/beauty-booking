import { UserRoundIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type TeamMemberAvatarProperties = {
  className?: string;
  imageSrc?: string;
};

export const TeamMemberAvatar = ({
  className,
  imageSrc,
}: TeamMemberAvatarProperties) => (
  <span
    className={cn(
      "flex size-11 min-h-11 min-w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-brand",
      className,
    )}
  >
    {imageSrc ? (
      <Image
        alt=""
        aria-hidden="true"
        className="size-full object-cover"
        height={44}
        src={imageSrc}
        width={44}
      />
    ) : (
      <UserRoundIcon className="size-5" aria-hidden="true" />
    )}
  </span>
);

export type { TeamMemberAvatarProperties };
