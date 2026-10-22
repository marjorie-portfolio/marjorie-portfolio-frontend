import {
  AppShell,
  Button,
  Flex,
  ActionIcon,
  Text,
  NavLink,
} from "@mantine/core";
import { IconHomeFilled, IconLayoutDashboardFilled } from "@tabler/icons-react";

import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../context/ThemeContext";
import { useLogout } from "../../query/auth";
import useAuthState from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const mobile = useMediaQuery("(max-width: 768px)");

  const logOut = useLogout();
  const { isAuthenticated } = useAuthState();
  const { logout } = useAuthState();

  const handleLogout = () =>
    logOut.mutate(undefined, {
      onSuccess: () => {
        logout();
      },
    });
  return (
    <AppShell.Navbar h={"100%"}>
      <Flex direction={"column"} align={"center"}>
        <NavLink
          label={
            <Text size="lg" fw={600} c={colors.accPrimary}>
              Home
            </Text>
          }
          leftSection={<IconHomeFilled size={20} color={colors.accPrimary} />}
          onClick={() => console.log("Navigated to Home")}
        />
        <NavLink
          label={
            <Text size="lg" fw={600} c={colors.accPrimary}>
              Dashboard
            </Text>
          }
          leftSection={
            <IconLayoutDashboardFilled size={22} color={colors.accPrimary} />
          }
          onClick={() => console.log("Navigated to Home")}
        />
        {isAuthenticated ? (
          <Button
            variant="outline"
            color={colors.accPrimary}
            size="xs"
            fz={15}
            w={"50%"}
            loading={logOut.isPending}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="outline"
            color={colors.accPrimary}
            size="xs"
            fz={15}
            w={"50%"}
            loading={logOut.isPending}
            onClick={handleLogout}
          >
            Sign In
          </Button>
        )}
        {mobile && (
          <Button
            variant="transparent"
            size="xs"
            w={"50%"}
            ff="Poppins"
            fw={600}
            fz={15}
            c={colors.bgBase}
          >
            CONTACT ME
          </Button>
        )}
      </Flex>
    </AppShell.Navbar>
  );
}
