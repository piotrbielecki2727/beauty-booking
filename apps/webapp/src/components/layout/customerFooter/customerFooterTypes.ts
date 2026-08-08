export type CustomerFooterLinkKey =
  | "howItWorks"
  | "findService"
  | "salonsAndSpecialists"
  | "help"
  | "faq"
  | "about"
  | "contact"
  | "blog"
  | "terms"
  | "privacy"
  | "cookies";

export type CustomerFooterLink = {
  href: string;
  labelKey: CustomerFooterLinkKey;
};

export type CustomerFooterSection = {
  labelKey: "customers" | "information";
  links: CustomerFooterLink[];
};

export type CustomerFooterSocial = {
  href: string;
  icon: "facebook" | "instagram" | "pinterest" | "tiktok" | "youtube";
  label: string;
};
