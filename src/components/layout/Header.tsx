import { AppShell, ActionIcon, Flex, Image, Text, Button, UnstyledButton } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import { useMediaQuery } from "@mantine/hooks";
import useAuthState from "../../store/useAuthStore";

import MK_light from "../../assets/icons/MK_light.png";
import MK_dark from "../../assets/icons/MK_dark.png";

type HeaderProps = {
  opened: boolean;
  onClick: () => void;
};

export default function Header({ opened, onClick }: HeaderProps) {

  const mobile = useMediaQuery("(max-width: 768px)");

  const { colors, mode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuthState();

  return (
    <AppShell.Header
      style={{
        borderBottom: `1px solid ${colors.bgBase}`,
        height: mobile ? "50px" : "60px",
      }}
    >
      <Flex h="100%" w={"100vw"} align="center" px="md" pr="30px" justify="space-between">
        <UnstyledButton onClick={onClick}>
          <Image
            src={mode === "light" ? MK_light : MK_dark}
            h={mobile ? 25 : 30}
            w="auto"
            fit="contain"
          />
        </UnstyledButton>

        <Flex align="center" gap="md">
          {isAuthenticated ? (
            <Text c={colors.text}>Welcome Back Marj!</Text>
          ) : mobile ? ("") : (
            <Button
              variant="transparent"
              ff="Poppins"
              fw={600}
              fz={mobile ? 15 : 20}
              c={colors.text} // Updated from color to c
            >
              CONTACT ME
            </Button>
          )}
          {!mobile &&
            <ActionIcon
              onClick={toggleTheme}
              variant="transparent"
              c={colors.text}
              size={mobile ? 22 : 30}

            >
              {mode === "dark" ? (
                <IconSun size={28} stroke={2} />
              ) : (
                <IconMoon size={25} stroke={3} />
              )}
            </ActionIcon>}
        </Flex>
      </Flex>
    </AppShell.Header>
  );
}