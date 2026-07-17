import { useDisclosure } from "@mantine/hooks";
import { AppShell } from "@mantine/core";

import { useTheme } from "../../context/ThemeContext";

import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";

export default function MainLayout() {
  const [opened, { toggle }] = useDisclosure(false);
  const { colors,} = useTheme();
  return (
    <AppShell
    withBorder={false}
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      styles={{
        main: {
          backgroundColor: colors.bgBase,
        },
         header: {
          backgroundColor: colors.bgBase,
        },
        navbar: {
          backgroundColor: colors.bgBase,
        },
      }}
    >
      <Header opened={opened} onClick={() => toggle()} />
      <SideBar />
      <Main opened={opened} toggle={() => toggle()}/>
    </AppShell>
  );
}
