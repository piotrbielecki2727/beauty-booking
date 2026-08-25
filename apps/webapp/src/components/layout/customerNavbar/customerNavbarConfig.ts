import type {
  CustomerAuthNavItemConfig,
  CustomerNavItemConfig,
} from "@/components/layout/customerNavbar/customerNavbarTypes";

export const customerNavItems: CustomerNavItemConfig[] = [
  {
    href: "/",
    labelKey: "home",
  },
  {
    href: "/inspirations",
    labelKey: "inspirations",
  },
  {
    href: "/services",
    labelKey: "services",
  },
  {
    href: "/pricing",
    labelKey: "pricing",
  },
  {
    href: "/contact",
    labelKey: "contact",
  },
];

export const customerAuthNavItems: CustomerAuthNavItemConfig[] = [
  {
    href: "/login",
    labelKey: "login",
    className:
      "rounded-b-md border border-brand bg-transparent text-brand hover:border-brand-hover hover:bg-brand hover:text-copy-inverse",
  },
  {
    href: "/register",
    labelKey: "register",
    className:
      "rounded-b-md border border-brand bg-brand text-copy-inverse hover:border-brand hover:bg-transparent hover:text-brand",
  },
];
