import { AppShell, Button, Flex, ActionIcon, Text } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../context/ThemeContext";
import { useLogout } from "../../query/auth";
import useAuthState from "../../store/useAuthStore";

export default function SideBar() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");

  const logOut = useLogout()
  const { isAuthenticated } = useAuthState()
  const { logout } = useAuthState()


  const handleLogout = () => logOut.mutate(undefined, {
    onSuccess: () => {
      logout()
    }
  })
  return (
    <AppShell.Navbar>
      {mobile && (
        <Button
          variant="transparent"
          ff="Poppins"
          fw={600}
          fz={mobile ? 15 : 20}
          c={colors.text}
        >
          CONTACT ME
        </Button>
      )}


      {isAuthenticated ? (<Button
        variant="outline"
        color={colors.accPrimary}
        size="xs" w={"50%"}
        loading={logOut.isPending}
        onClick={handleLogout}
      >
        Sign Out
      </Button>) : (<Button
        variant="outline"
        color={colors.accPrimary}
        size="xs" w={"50%"}
        loading={logOut.isPending}
        onClick={handleLogout}
      >
        Sign In
      </Button>)}



    </AppShell.Navbar>
  );
}
