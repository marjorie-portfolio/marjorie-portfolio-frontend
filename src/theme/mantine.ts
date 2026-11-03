import type { MantineThemeOverride } from "@mantine/core";
import { lightModeColors } from "./colors";

const primary = [
  "#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185",
  "#f43f5e", "#e11d48", lightModeColors.accPrimary, "#9f1239", "#881337",
] as const;

export const mantineTheme: MantineThemeOverride = {
  fontFamily: "Poppins",
  primaryColor: "primary",
  primaryShade: 7,
  colors: { primary },
  components: {
    Modal: {
      defaultProps: { radius: 20 },
      styles: { content: { backgroundColor: "var(--mantine-color-body)" }, header: { borderBottom: "1px solid var(--mantine-color-default-border)" } },
    },
    Button: { styles: { root: { borderRadius: 999, fontWeight: 700, textTransform: "uppercase" } } },
    TextInput: { styles: { label: { fontWeight: 800, fontSize: "var(--mantine-font-size-xs)", textTransform: "uppercase" }, input: { borderRadius: 999 } } },
    FileInput: { styles: { label: { fontWeight: 800, fontSize: "var(--mantine-font-size-xs)", textTransform: "uppercase" }, input: { borderRadius: 999 } } },
    ActionIcon: { styles: { root: { borderRadius: 999, color: "var(--mantine-color-text)" } } },
  },
};
