import {
  AppShell,
  Button,
  Flex,
  Divider,
  Text,
  NavLink,
  Loader,
} from "@mantine/core";
import {
  IconHomeFilled,
  IconLayoutDashboardFilled,
  IconCloverFilled,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTheme } from "../../context/ThemeContext";
import { useLogout } from "../../query/auth";
import useAuthState from "../../store/useAuthStore";
import { sectionQueries } from "../../query/sections.query";
import { openContactModal } from "../modals/ContactModal";

type SideBarProps = {
  onNavigate?: () => void;
};

export default function SideBar({ onNavigate }: SideBarProps) {
  const { pathname } = useLocation();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const isActive = (path: string) => pathname === path;

  const linkStyles = (active: boolean) => ({
    root: {
      borderRadius: 8,
      backgroundColor: active ? colors.bgBase : "transparent",
    },
  });
  const mobile = useMediaQuery("(max-width: 768px)");
  const { data: sections, isLoading } = useQuery(sectionQueries.all());

  const logOut = useLogout();
  const queryClient = useQueryClient();
  const { isAuthenticated, logout } = useAuthState();

  const handleLogout = () =>
    logOut.mutate(undefined, {
      onSuccess: () => {
        logout();
        queryClient.removeQueries({ queryKey: ["current-user"] });
        queryClient.removeQueries({ queryKey: ["sections"] });
        queryClient.removeQueries({ queryKey: ["cards"] });
        queryClient.removeQueries({ queryKey: ["acitvity-logs"] });
        queryClient.removeQueries({ queryKey: ["visits"] });
        navigate("/sign-in", { replace: true });
      },
    });

  return (
    <AppShell.Navbar>
      <Flex h={"100vh"} direction={"column"} p={10} align={"center"} w={"100%"}>
        <NavLink
          active={isActive("/")}
          styles={linkStyles(isActive("/"))}
          label={
            <Text size="lg" fw={600} c={colors.accPrimary}>
              Home
            </Text>
          }
          leftSection={<IconHomeFilled size={20} color={colors.accPrimary} />}
          onClick={() => goTo("/")}
        />

        <NavLink
          active={isActive("/dashboard")}
          styles={linkStyles(isActive("/dashboard"))}
          label={
            <Text size="lg" fw={600} c={colors.accPrimary}>
              Dashboard
            </Text>
          }
          leftSection={
            <IconLayoutDashboardFilled size={22} color={colors.accPrimary} />
          }
          onClick={() => goTo("/dashboard")}
        />

        {isLoading ? (
          <Loader type="dots" color={colors.accPrimary} />
        ) : (
          <Divider
            w={"100%"}
            my="sm"
            label={
              <Text size="xs" fw={700} c={colors.accPrimary}>
                SECTIONS
              </Text>
            }
            labelPosition="center"
            size="sm"
            color={colors.accPrimary}
          />
        )}

        {sections?.data?.map((section) => {
          const path = `/section/${section.id}`;
          return (
            <>
              <NavLink
                key={section.id ?? section.title}
                active={isActive(path)}
                styles={linkStyles(isActive(path))}
                label={
                  <Text size="md" fw={600} c={colors.accPrimary}>
                    {section.title}
                  </Text>
                }
                leftSection={
                  <IconCloverFilled size={20} color={colors.accPrimary} />
                }
                onClick={() => goTo(path)}
              />
            </>
          );
        })}
        {mobile && (
          <Button
            variant={"outline"}
            color={colors.accPrimary}
            size="xs"
            w={"50%"}
            ff="Poppins"
            fw={600}
            fz={15}
            onClick={() => openContactModal(colors.accPrimary)}
          >
            CONTACT MARJORIE!
          </Button>
        )}
        {isAuthenticated ? (
          <Button
            color={colors.accPrimary}
            size="xs"
            fz={15}
            w={"50%"}
            mt="20"
            mb="md"
            loading={logOut.isPending}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            color={colors.accPrimary}
            size="xs"
            fz={15}
            w={"50%"}
            mt="md"
            loading={logOut.isPending}
            onClick={() => goTo("/sign-in")}
          >
            Sign In
          </Button>
        )}
      </Flex>
    </AppShell.Navbar>
  );
}
