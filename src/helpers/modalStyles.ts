import type { darkModeColors, lightModeColors } from "../theme/colors";

type ThemeColors = typeof lightModeColors | typeof darkModeColors;

interface ModalStyleOptions {
  hideScrollbar?: boolean;
  bodyPadding?: number;
  compactHeader?: boolean;
}

export function getModalStyles(
  colors: ThemeColors,
  {
    hideScrollbar = false,
    bodyPadding,
    compactHeader = false,
  }: ModalStyleOptions = {},
) {
  return {
    content: {
      ...(hideScrollbar && {
        scrollbarWidth: "none" as const,
        "-ms-overflow-style": "none",
        "&::-webkit-scrollbar": { display: "none" },
      }),
    },
    header: {
      backgroundColor: colors.bgSurface,
      borderBottom: `2px solid ${colors.bgHighlight}`,
      ...(compactHeader && { marginBottom: 10 }),
    },
    body: {
      backgroundColor: colors.bgSurface,
      ...(bodyPadding !== undefined && { padding: bodyPadding }),
    },
    title: { color: colors.text, fontWeight: compactHeader ? 700 : 800, fontSize: "20px"},
    close: { color: colors.text },
  };
}
