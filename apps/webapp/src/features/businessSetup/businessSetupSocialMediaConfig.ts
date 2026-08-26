import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

import type { BusinessDetailsForm } from "@beauty-booking/shared";
import type { IconType } from "react-icons";

export const businessSetupSocialMediaFields = [
  { icon: FaInstagram, key: "instagram", name: "instagramUrl" },
  { icon: FaFacebook, key: "facebook", name: "facebookUrl" },
  { icon: FaTiktok, key: "tiktok", name: "tiktokUrl" },
  { icon: FaPinterest, key: "pinterest", name: "pinterestUrl" },
  { icon: FaYoutube, key: "youtube", name: "youtubeUrl" },
] as const satisfies ReadonlyArray<{
  icon: IconType;
  key: string;
  name: keyof BusinessDetailsForm;
}>;
