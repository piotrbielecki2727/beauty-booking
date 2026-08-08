import type {
  CustomerFooterSection,
  CustomerFooterSocial,
} from "@/components/layout/customerFooter/customerFooterTypes";

export const customerFooterSections: CustomerFooterSection[] = [
  {
    labelKey: "customers",
    links: [
      {
        href: "/",
        labelKey: "howItWorks",
      },
      {
        href: "/",
        labelKey: "findService",
      },
      {
        href: "/",
        labelKey: "salonsAndSpecialists",
      },
      {
        href: "/",
        labelKey: "help",
      },
      {
        href: "/",
        labelKey: "faq",
      },
    ],
  },
  {
    labelKey: "information",
    links: [
      {
        href: "/",
        labelKey: "about",
      },
      {
        href: "/",
        labelKey: "contact",
      },
      {
        href: "/",
        labelKey: "blog",
      },
    ],
  },
];

export const customerFooterLegalLinks = [
  {
    href: "/",
    labelKey: "terms",
  },
  {
    href: "/",
    labelKey: "privacy",
  },
  {
    href: "/",
    labelKey: "cookies",
  },
] satisfies CustomerFooterSection["links"];

export const customerFooterSocials: CustomerFooterSocial[] = [
  {
    href: "/",
    icon: "instagram",
    label: "Instagram",
  },
  {
    href: "/",
    icon: "facebook",
    label: "Facebook",
  },
  {
    href: "/",
    icon: "tiktok",
    label: "TikTok",
  },
  {
    href: "/",
    icon: "youtube",
    label: "YouTube",
  },
  {
    href: "/",
    icon: "pinterest",
    label: "Pinterest",
  },
];
