import { AppShell, ActionIcon, Flex, Image, Text, Button, UnstyledButton } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import { useMediaQuery } from "@mantine/hooks";
import useAuthState from "../../store/useAuthStore";
import { openContactModal } from "../modals/ContactModal";

import MK_light from "../../assets/icons/MK_dark.png";
import MK_dark from "../../assets/icons/MK_light.png";

type HeaderProps = {
  opened: boolean;
  onClick: () => void;
};

export default function Header({ onClick }: HeaderProps) {

  const mobile = useMediaQuery("(max-width: 768px)");

  const { colors, mode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuthState();

  return (
    <AppShell.Header
      style={{
        borderBottom: `1px solid ${colors.text}`,
        height: mobile ? "50px" : "40px",
      }}
    >
      <Flex h="100%" w={"100vw"} align="center" px="md" pr="30px" justify="space-between">
        <UnstyledButton onClick={onClick}>
          <Image
            src={mode === "light" ? MK_light : MK_dark}
            h={mobile ? 25 : 20}
            w="auto"
            fit="contain"
          />
        </UnstyledButton>

        <Flex align="center" gap="md">
          {isAuthenticated ? (
            <Text c={colors.bgBase}>Welcome Back Marj!</Text>
          ) : mobile ? ("") : (
            <Button
              variant="transparent"
              ff="Poppins"
              fw={500}
              fz={mobile ? 15 : 18}
              c={colors.accPrimary} 
              onClick={() => openContactModal(colors.accPrimary)}
            >
              CONTACT MARJORIE!
            </Button>
          )}
            <ActionIcon
              onClick={toggleTheme}
              variant="transparent"
              c={colors.bgBase}
              size={mobile ? 22 : 30}

            >
              {mode === "dark" ? (
                <IconSun size={mobile? 100 :28} stroke={2} />
              ) : (
                <IconMoon size={mobile? 100 :20} stroke={3} />
              )}
            </ActionIcon>
        </Flex>
      </Flex>
    </AppShell.Header>
  );
}