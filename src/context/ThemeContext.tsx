import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

import { lightModeColors, darkModeColors } from "../theme/colors";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof lightModeColors | typeof darkModeColors;
  toggleTheme: () => void;
}

interface Props {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}

export  function ThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = mode === "light" ? lightModeColors : darkModeColors;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
