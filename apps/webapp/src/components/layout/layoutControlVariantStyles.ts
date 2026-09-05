export type LayoutControlVariant = "default" | "nav" | "sidebar";

export const sidebarControlClassNames =
  "text-brand transition-colors hover:bg-sidebar-accent focus-visible:outline-sidebar-ring";

export const sidebarControlActiveClassNames =
  "bg-sidebar-accent font-semibold";

export const layoutControlBorderClassNames: Record<
  LayoutControlVariant,
  string
> = {
  default: "",
  nav: "border-line",
  sidebar: "border-sidebar-border",
};

export const layoutControlClassNames: Record<LayoutControlVariant, string> = {
  default:
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-ring",
  nav: "text-brand hover:bg-surface-hover hover:text-brand-hover focus-visible:outline-brand",
  sidebar: sidebarControlClassNames,
};

export const layoutControlActiveClassNames: Record<
  LayoutControlVariant,
  string
> = {
  default: "bg-accent text-accent-foreground",
  nav: "bg-surface-hover text-brand-hover",
  sidebar: sidebarControlActiveClassNames,
};
