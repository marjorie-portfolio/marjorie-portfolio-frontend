import { Outlet } from "react-router-dom";
import { AppShell, Overlay } from "@mantine/core";

import { useTheme } from "../../context/ThemeContext";
import { createPlus4Pattern } from "../../utils/pattern/plus4Pattern";

type MainProps = {
  opened: boolean;
  toggle: () => void
}

export default function Main({opened, toggle}: MainProps) {
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

        backgroundSize: "60px 64px",

        backgroundRepeat: "repeat",
      }}
    >
      {opened && (
          <Overlay
            color="#000"
            backgroundOpacity={0.1} 
            blur={1}                
            zIndex={100}            
            onClick={toggle}         
          />
        )}
      <Outlet />
    </AppShell.Main>
  );
}