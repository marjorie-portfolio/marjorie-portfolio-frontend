import { AppShell, Button } from "@mantine/core";

import { useTheme } from "../../context/ThemeContext";
import { useLogout } from "../../query/auth";
import useAuthState from "../../store/useAuthStore";

export default function SideBar() {
  const { colors } = useTheme();

  const logOut = useLogout()
  const {logout } = useAuthState()

  const handleLogout = () =>  logOut.mutate(undefined,{
    onSuccess: () => {
      logout()
    }
  })
  return (
    <AppShell.Navbar>

      <Button variant="outline" color={colors.accPrimary} size="xs" w={"50%"} loading={logOut.isPending} onClick={handleLogout}>
        Sign Out
      </Button>
    </AppShell.Navbar>
  );
}
