export type CustomerNavItemConfig = {
  href: string;
  labelKey:
    | "home"
    | "bookings"
    | "services"
    | "contact"
    | "pricing"
    | "inspirations";
};

export type CustomerAuthNavItemConfig = {
  href: string;
  labelKey: "login" | "register";
  className?: string;
};
