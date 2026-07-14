import { useMantineColorScheme } from "@mantine/core";
import { lightModeColors, darkModeColors } from "../theme/colors";

export function useThemeColors() {
  const { colorScheme } = useMantineColorScheme();

  return colorScheme === "dark" ? darkModeColors : lightModeColors;
}
