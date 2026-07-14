import { AppShell, ActionIcon, Flex, Button, Text } from "@mantine/core";

import { IconSun, IconMoon, IconMenu2 } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";

type HeaderProps = {
  opened: boolean;
  onClick: () => void;
};

export default function Header({ opened, onClick }: HeaderProps) {
  const { colors, mode, toggleTheme } = useTheme();
  return (
    <AppShell.Header>
      <Flex h="100%" align="center" px="md">
        <ActionIcon onClick={onClick} variant="transparent" size={60}>
          <IconMenu2 size={30} />
        </ActionIcon>
        <>
        <Text ff="Poppins" fw={700}>
    CONTACT ME {" "}
  </Text>

  <Text ff="Times New Roman" fw={700}>
    CONTACT ME
  </Text>

        <Button variant="transparent" ff={"Poppins"} fw={700}>CONTACT ME</Button><Button variant="transparent" ff={"Poppins"} fw={500}>CONTACT ME</Button>
          {mode === "dark" ? (
            <ActionIcon
              onClick={onClick}
              variant="transparent"
              color={colors.text}
              size={60}
            >
              <IconSun size={30} stroke={3} />
            </ActionIcon>
          ) : (
            <ActionIcon
              onClick={onClick}
              variant="transparent"
              color={colors.text}
              size={60}
            >
              <IconMoon size={30} stroke={3} />
            </ActionIcon>
          )}
        </>
      </Flex>
    </AppShell.Header>
  );
}
