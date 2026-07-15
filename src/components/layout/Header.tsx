import { AppShell, ActionIcon, Flex, Image, Text } from "@mantine/core";

import { IconSun, IconMoon, IconMenu2 } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";

import MK_light from "../../assets/icons/MK_light.png"
import MK_dark from "../../assets/icons/MK_dark.png"

type HeaderProps = {
  opened: boolean;
  onClick: () => void;
};

export default function Header({ opened, onClick }: HeaderProps) {
  const { colors, mode, toggleTheme } = useTheme();

  console.log(mode)
  return (
    <AppShell.Header >
      <Flex h="100%" align="center" px="md" justify={"space-between"}>
        <ActionIcon onClick={onClick} variant="transparent" size={60}>
          <Image
          src={mode === "light" ? MK_light : MK_dark}
          />
        </ActionIcon>

        <Flex align="center" >
        {/* <Button variant="transparent" ff={"Poppins"} fw={700} fz={20} color={colors.text}>CONTACT ME</Button> */}
          {mode === "dark" ? (
            <ActionIcon
              onClick={toggleTheme}
              variant="transparent"
              color={colors.text}
              size={60}
            >
              <IconSun size={35} stroke={2} />
            </ActionIcon>
          ) : (
            <ActionIcon
              onClick={toggleTheme}
              variant="transparent"
              color={colors.text}
              size={50}
            >
              <IconMoon size={25} stroke={3} />
            </ActionIcon>
          )}
        </Flex>
      </Flex>
    </AppShell.Header>
  );
}
