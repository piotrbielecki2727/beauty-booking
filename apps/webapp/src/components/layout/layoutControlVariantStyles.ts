export type LayoutControlVariant = "default" | "nav" | "sidebar";

export const layoutControlBorderClassNames: Record<
  LayoutControlVariant,
  string
> = {
  default: "",
  nav: "border-nav-border",
  sidebar: "border-sidebar-border",
};

export const layoutControlClassNames: Record<LayoutControlVariant, string> = {
  default:
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-ring",
  nav: "text-nav-foreground/80 hover:bg-nav-accent hover:text-nav-accent-foreground focus-visible:outline-nav-ring",
  sidebar:
    "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-sidebar-ring",
};

export const layoutControlActiveClassNames: Record<
  LayoutControlVariant,
  string
> = {
  default: "bg-accent text-accent-foreground",
  nav: "bg-nav-accent text-nav-accent-foreground",
  sidebar: "bg-sidebar-accent text-sidebar-accent-foreground",
};
