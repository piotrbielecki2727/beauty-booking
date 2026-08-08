import type { AppTheme } from "@/theme/theme.types";

export const themes = {
  nude: {
    label: "Nude / Rose Beige",
  },
  mauve: {
    label: "Mauve / Blush",
  },
  burgundy: {
    label: "Burgundy / Blush",
  },
} satisfies Record<AppTheme, { label: string }>;
