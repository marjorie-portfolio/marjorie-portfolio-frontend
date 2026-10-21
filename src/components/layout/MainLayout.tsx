import { useDisclosure } from "@mantine/hooks";
import { AppShell } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../context/ThemeContext";

import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";

export default function MainLayout() {
  const [opened, { toggle }] = useDisclosure(false);
   const mobile = useMediaQuery("(max-width: 768px)");
  const { colors,} = useTheme();
  return (
    <AppShell
    withBorder={false}
      header={{ height: 40 }}
      navbar={{
        width: mobile? 1: 300,
        breakpoint: "xs",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      styles={{
        main: {
          backgroundColor: colors.bgBase,
        },
         header: {
          backgroundColor: colors.text,
        },
        navbar: {
          backgroundColor: colors.text,
        },
      }}
    >
      <Header opened={opened} onClick={() => toggle()} />
      <SideBar />
      
      <Main/>
    </AppShell>
  );
}
