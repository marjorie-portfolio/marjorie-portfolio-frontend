import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";

import { useTheme } from "../../context/ThemeContext";
import { createPlus4Pattern } from "../../utils/pattern/plus4Pattern";



export default function Main() {
  const {colors } = useTheme();

  const pattern = createPlus4Pattern(
    colors.bgBase,
    colors.text,
   colors.accSecondary
  );

  return (
    <AppShell.Main
    px={0}
      style={{
        minHeight: "100vh",

        backgroundColor: colors.bgBase,

        backgroundImage: pattern,

        backgroundSize: "40px 44px",

        backgroundRepeat: "repeat",
      }}
    >
     
      <Outlet />
    </AppShell.Main>
  );
}